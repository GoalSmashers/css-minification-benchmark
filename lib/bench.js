#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Q = require('q');
const storage = require('./storage');
const minify = require('./minify');
const bugs = require('./bugs');

module.exports = (args, input, output) => {
  // ARGUMENTS
  const { only, total: showTotal, gzip: measureGzip } = args;

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
      })
        .done();
    } catch (error) {
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
    activeMinifiers.forEach(minifier => {
      if (bugs[minifier.name] && bugs[minifier.name][filename]) {
        storage.save(filename, minifier.name, { label: 'bug' });
        process.stderr.write('B');
        return;
      }

      result = result.then(() => {
        return measure(filename, minifier, source);
      });
    });

    return result.then(() => {
      activeMinifiers.forEach(minifier => {
        minifier.results[filename] = storage.get(filename, minifier.name);
      });
    });
  };

  let promise = Q();
  input.forEach(filename => {
    promise = promise.then(() => {
      return benchmark(filename);
    });
  });
  promise.then(() => {
    process.stderr.write('\n');

    if (showTotal) {
      activeMinifiers.forEach(minifier => {
        minifier.total = storage.total(minifier.name);
      });
    }

    output(processedFiles, activeMinifiers);
  }).done();
};
