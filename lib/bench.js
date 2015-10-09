#!/usr/bin/env node
module.exports = function (args, input, output) {

  var storage = require('./storage');
  var minify = require('./minify');
  var bugs = require('./bugs');
  var fs = require('fs');
  var path = require('path');
  var Q = require('q');


  // ARGUMENTS
  var only = args.only;
  var showTotal = args.total;
  var measureGzip = args.gzip;

  // RUN BENCHMARK
  var activeMinifiers = minify.getActive(only);
  var processedFiles = {};

  var measure = function (filename, minifier, source) {
    var deferred = Q.defer();
    try {
      var promise = minify.measure(minifier.name, source, measureGzip);
      promise.then(function (stats) {
        processedFiles[filename].gzip = stats.originalgzip;

        storage.save(filename, minifier.name, stats);
        process.stderr.write('.');
        deferred.resolve();
      })
      .done();
    } catch (e) {
      storage.save(filename, minifier.name, { label: 'error' });
      process.stderr.write('F');
      deferred.resolve();
    }
    return deferred.promise;
  };

  var benchmark = function(filename) {
    if (filename.indexOf('.css') == -1) {
      return Q();
    }

    var source = fs.readFileSync(path.join('data', filename), 'utf8');
    processedFiles[filename] = {
      size: source.length
    };

    var result = Q();
    activeMinifiers.forEach(function (minifier) {
      if (bugs[minifier.name] && bugs[minifier.name][filename]) {
        storage.save(filename, minifier.name, { label: 'bug' });
        process.stderr.write('B');
        return;
      }

      result = result.then(function () {
        return measure(filename, minifier, source);
      });
    });

    return result.then(function () {
      activeMinifiers.forEach(function (minifier) {
        minifier.results[filename] = storage.get(filename, minifier.name);
      });
    });
  };

  var promise = Q();
  input.forEach(function (filename) {
    promise = promise.then(function () {
      return benchmark(filename);
    });
  });
  promise.then(function () {
    process.stderr.write('\n');

    if (showTotal) {
      activeMinifiers.forEach(function(minifier) {
        minifier.total = storage.total(minifier.name);
      });
    }

    output(processedFiles, activeMinifiers);
  }).done();

};
