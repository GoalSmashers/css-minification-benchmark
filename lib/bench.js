#!/usr/bin/env node
module.exports = function (args, input, output) {

  var storage = require('./storage');
  var minify = require('./minify');
  var bugs = require('./bugs');
  var fs = require('fs');
  var path = require('path');


  // ARGUMENTS
  var only = args.only;
  var showTotal = args.total;
  var measureGzip = args.gzip;

  // RUN BENCHMARK
  var activeMinifiers = minify.getActive(only);
  var processedFiles = {};

  var benchmark = function(filename) {
    if (filename.indexOf('.css') == -1)
      return;

    var source = fs.readFileSync(path.join('data', filename), 'utf8');
    processedFiles[filename] = {
      size: source.length
    };

    activeMinifiers.forEach(function(minifier) {
      if (bugs[minifier.name] && bugs[minifier.name][filename]) {
        storage.save(filename, minifier.name, { label: 'bug' });
        process.stderr.write('B');
        return;
      }

      try {
        var stats = minify.measure(minifier.name, source, measureGzip);
        processedFiles[filename].gzip = stats.originalgzip;

        storage.save(filename, minifier.name, stats);
        process.stderr.write('.');
      } catch (e) {
        storage.save(filename, minifier.name, { label: 'error' });
        process.stderr.write('F');
      }
    });

    activeMinifiers.forEach(function(minifier) {
      minifier.results[filename] = storage.get(filename, minifier.name);
    });
  };


  input.forEach(benchmark);
  process.stderr.write('\n');

  if (showTotal) {
    activeMinifiers.forEach(function(minifier) {
      minifier.total = storage.total(minifier.name);
    });
  }

  output(processedFiles, activeMinifiers);

};
