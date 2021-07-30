#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const Q = require('q');
const storage = require('./storage.js');
const minify = require('./minify.js');
const bugs = require('./bugs.js');

module.exports = (args, input, output) => {
  // ARGUMENTS
  const { only, gzip: measureGzip } = args;

  // RUN BENCHMARK
  const activeMinifiers = minify.getActive(only);
  const processedFiles = {};

  const measure = (filename, minifier, source) => {
    const deferred = Q.defer();
    try {
      const promise = minify.measure(minifier.name, source, measureGzip);
      promise.then(stats => {
        processedFiles[filename].gzip = stats.originalgzip;

        storage.save(filename, minifier.name, stats);
        process.stderr.write('.');
        deferred.resolve();
      }).done();
    } catch {
      storage.save(filename, minifier.name, { label: 'error' });
      process.stderr.write('F');
      deferred.resolve();
    }

    return deferred.promise;
  };

  const benchmark = filename => {
    if (!filename.includes('.css')) {
      return Q();
    }

    const source = fs.readFileSync(path.join('data', filename), 'utf8');
    processedFiles[filename] = {
      size: source.length
    };

    let result = Q();
    for (const minifier of activeMinifiers) {
      if (bugs[minifier.name] && bugs[minifier.name][filename]) {
        storage.save(filename, minifier.name, { label: 'bug' });
        process.stderr.write('B');
        continue;
      }

      result = result.then(() => measure(filename, minifier, source));
    }

    return result.then(() => {
      for (const minifier of activeMinifiers) {
        minifier.results[filename] = storage.get(filename, minifier.name);
      }
    });
  };

  let promise = Q();
  for (const filename of input) {
    promise = promise.then(() => benchmark(filename));
  }

  promise.then(() => {
    process.stderr.write('\n');

    for (const minifier of activeMinifiers) {
      minifier.total = storage.total(minifier.name);
    }

    output(processedFiles, activeMinifiers);
  }).done();
};
