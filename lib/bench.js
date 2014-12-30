#!/usr/bin/env node
module.exports = function (args, input, output) {

  var storage = require('./storage');
  var minify = require('./minify');
  var fs = require('fs');
  var path = require('path');

  // ARGUMENTS
  var only = args.only;
  var showTotal = args.total;
  var measureGzip = args.gzip;

  var activeMinifiers = minify.getActive(only).map(function(name) {
    var packageName = name.split(' ')[0];
    var packageDefinition = JSON.parse(fs.readFileSync(path.join('node_modules', packageName, 'package.json')));
    var repositoryUrl = packageDefinition.repository &&
      packageDefinition.repository.url &&
      packageDefinition.repository.url.replace(/^git:\/\//, 'https://');
    var version = packageDefinition.version;

    return {
      name: name,
      version: version,
      url: repositoryUrl,
      results: {}
    };
  });

  var processedFiles = {};

  var benchmark = function(filename) {
    if (filename.indexOf('.css') == -1)
      return;

    var source = fs.readFileSync(path.join('data', filename), 'utf8');
    processedFiles[filename] = {
      size: source.length
    };

    activeMinifiers.forEach(function(minifier) {
      try {
        var stats = minify.measure(minifier.name, source, measureGzip);

        storage.save(filename, minifier.name, stats);
        process.stderr.write('.');
      } catch (e) {
        storage.save(filename, minifier.name);
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