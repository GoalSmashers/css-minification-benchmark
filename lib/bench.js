#!/usr/bin/env node
module.exports = function (args, input, output) {

  var CleanCSS = require('clean-css');
  var cssCondense = require('css-condense');
  var csso = require('csso');
  var cssshrink = require('cssshrink');
  var csswring = require('csswring');
  var moreCss = require('more-css');
  var ncss = require('ncss');
  var sqwish = require('sqwish');
  var ycssmin = require('ycssmin');

  var Table = require('cli-table');
  var HTMLTable = require('./html-table');
  var formatRow = require('./format-row');
  var storage = require('./storage');
  var fs = require('fs');
  var path = require('path');
  require('colors');

  var lineBreak = require('os').EOL;

  // ARGUMENTS
  var only = args.only;
  var asHTML = args.asHTML;
  var showTotal = args.total;

  // MINIFIERS
  var minifiers = {
    'clean-css': function(source) {
      return new CleanCSS({ processImport: false }).minify(source).styles;
    },
    'clean-css (advanced off)': function(source) {
      return new CleanCSS({ advanced: false, processImport: false }).minify(source).styles;
    },
    'css-condense': function(source) {
      return cssCondense.compress(source, { safe: true });
    },
    'csso': csso.justDoIt,
    'csso (reordering off)': function(source) {
      return csso.justDoIt(source, true);
    },
    'cssshrink': cssshrink.shrink,
    'csswring': function (source) {
      return csswring.wring(source).css;
    },
    'more-css': function(source) {
      return moreCss.compress(source, true);
    },
    'ncss': ncss,
    'sqwish': sqwish.minify,
    'ycssmin': ycssmin.cssmin
  };

  var activeMinifiers = [];
  for (var name in minifiers) {
    if (only.test(name))
      activeMinifiers.push(name);
  }

  // RUN BENCHMARK
  var minifierNames = activeMinifiers.slice(0).map(function(name) {
    var packageName = name.split(' ')[0];
    var packageDefinition = JSON.parse(fs.readFileSync(path.join('node_modules', packageName, 'package.json')));
    var repositoryUrl = packageDefinition.repository &&
      packageDefinition.repository.url &&
      packageDefinition.repository.url.replace(/^git:\/\//, 'https://');
    var version = packageDefinition.version;

    if (asHTML && repositoryUrl)
      return '<a href="' + repositoryUrl + '">' + name + ' - ' + version + '</a>';
    else
      return name + ' - ' + version;
  });
  minifierNames.unshift('');

  var tableClass = asHTML ? HTMLTable : Table;
  var results = new tableClass({ head: minifierNames });
  var totalLength = 0;

  var benchmark = function(filename) {
    if (filename.indexOf('.css') == -1)
      return;

    var source = fs.readFileSync(path.join('data', filename), 'utf8');
    var size = asHTML ?
      ' - <em>' + source.length + ' bytes</em>' :
      ' - ' + source.length + ' bytes';
    var row = [filename + size];
    totalLength += source.length;

    activeMinifiers.forEach(function(name) {
      try {
        var start = process.hrtime();
        var minified = minifiers[name](source);
        var itTook = process.hrtime(start);
        var took = Math.round((1000 * itTook[0] + itTook[1] / 1000000) * 100) / 100;

        storage.save(filename, name, minified.length, took);
        process.stderr.write('.');
      } catch (e) {
        storage.save(filename, name, NaN, NaN);
        process.stderr.write('F');
      }
    });

    activeMinifiers.forEach(function(name) {
      row.push(formatRow(asHTML, storage.get(filename, name)));
    });

    results.push(row);
  };


  input.forEach(benchmark);

  if (showTotal) {
    var totalRow = ['TOTAL - ' + (asHTML ?
      ('<em>' + totalLength + ' bytes</em>') :
      (totalLength + ' bytes')
    )];
    activeMinifiers.forEach(function(name) {
      totalRow.push(formatRow(asHTML, storage.total(name)));
    });
    results.push(totalRow);
  }

  output(lineBreak);
  output(results.toString());
  output(lineBreak);

};