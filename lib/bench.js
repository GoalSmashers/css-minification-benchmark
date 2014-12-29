#!/usr/bin/env node
module.exports = function (args, input, output) {

  var Table = require('cli-table');
  var HTMLTable = require('./html-table');
  var formatRow = require('./format-row');
  var storage = require('./storage');
  var minify = require('./minify');
  var fs = require('fs');
  var path = require('path');
  require('colors');

  var lineBreak = require('os').EOL;

  // ARGUMENTS
  var only = args.only;
  var asHTML = args.asHTML;
  var showTotal = args.total;
  var measureGzip = args.gzip;

  var activeMinifiers = minify.getActive(only);

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
        var stats = minify.measure(name, source, measureGzip);

        storage.save(filename, name, stats);
        process.stderr.write('.');
      } catch (e) {
        storage.save(filename, name, NaN, NaN);
        process.stderr.write('F');
      }
    });

    activeMinifiers.forEach(function(name) {
      row.push(formatRow(asHTML, storage.get(filename, name), measureGzip));
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
      totalRow.push(formatRow(asHTML, storage.total(name), measureGzip));
    });
    results.push(totalRow);
  }

  output(lineBreak);
  output(results.toString());
  output(lineBreak);

};