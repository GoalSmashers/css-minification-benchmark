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
  var fs = require('fs');
  var path = require('path');
  require('colors');

  var lineBreak = require('os').EOL;

  // ARGUMENTS
  var only = args.only;
  var asHTML = args.asHTML;

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

  // FORMATTING
  var styled = function(value, color, bootstrapClass) {
    return asHTML ?
      { 'class': bootstrapClass, value: value } :
      value[color];
  };

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

  var comparator = function(n1, n2) {
    return n1 > n2 ? 1 : -1;
  };
  var benchmark = function(filename) {
    if (filename.indexOf('.css') == -1)
      return;

    var source = fs.readFileSync(path.join('data', filename), 'utf8');
    var size = asHTML ?
      ' - <em>' + source.length + ' bytes</em>' :
      ' - ' + source.length + ' bytes';
    var row = [filename + size];
    var sizes = [];
    var times = [];

    activeMinifiers.forEach(function(name) {
      try {
        var start = process.hrtime();
        var minified = minifiers[name](source);
        var itTook = process.hrtime(start);
        var took = Math.round((1000 * itTook[0] + itTook[1] / 1000000) * 100) / 100;

        sizes.push(minified.length);
        times.push(took);
        row.push({ size: minified.length, time: took });
        process.stderr.write('.');
      } catch (e) {
        row.push({ size: -1, time: -1 });
        process.stderr.write('F');
      }
    });

    sizes = sizes.sort(comparator);
    times = times.sort(comparator);

    row = row.map(function(result) {
      if (result.time == -1)
        return styled('error', 'red', 'danger');
      if (typeof result == 'string')
        return result;

      // var value = result.size + ' bytes (' + result.time + ' ms)';
      var value = result.size + ' bytes';
      var valueStyled = value;
      var formatted = asHTML ? {} : '';

      if (result.size == sizes[sizes.length - 1] && sizes.length > 1 && sizes[0] != sizes[sizes.length - 1])
        valueStyled = styled(value, 'red', 'danger');
      if (result.size == sizes[0])
        valueStyled = styled(value, 'green', 'success');

      if (asHTML) {
        formatted.size = valueStyled.value || value;
        formatted.sizeClass = valueStyled.class || 'default';
      }
      else
        formatted = valueStyled;

      valueStyled = value = result.time + ' ms';

      if (result.time == times[times.length - 1] && times.length > 1 && times[0] != times[times.length - 1])
        valueStyled = styled(value, 'red', 'danger');
      if (result.time == times[0])
        valueStyled = styled(value, 'green', 'success');
      if (asHTML) {
        formatted.time = valueStyled.value || value;
        formatted.timeClass = valueStyled.class || 'default';
      }
      else
        formatted += ' - ' + valueStyled;

      return formatted;
    });

    results.push(row);
  };

  input.forEach(benchmark);

  output(lineBreak);
  output(results.toString());
  output(lineBreak);

};