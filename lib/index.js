#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');
const storage = require('./storage.js');
const minify = require('./minify.js');

const bench = async (args, input, output) => {
  // ARGUMENTS
  const { only, gzip: measureGzip } = args;

  // RUN BENCHMARK
  const activeMinifiers = minify.getActive(only);
  const processedFiles = {};

  const measure = async (filename, minifier, source) => {
    try {
      const stats = await minify.measure(minifier.name, source, measureGzip);
      processedFiles[filename].gzip = stats.originalgzip;
      storage.save(filename, minifier.name, stats);
      process.stderr.write('.');
    } catch {
      storage.save(filename, minifier.name, { label: 'error' });
      process.stderr.write('F');
    }
  };

  const benchmark = async filename => {
    if (!filename.endsWith('.css')) {
      return;
    }

    const source = fs.readFileSync(path.join('data', filename), 'utf8');
    processedFiles[filename] = {
      size: source.length
    };

    for (const minifier of activeMinifiers) {
      await measure(filename, minifier, source);
    }

    for (const minifier of activeMinifiers) {
      minifier.results[filename] = storage.get(filename, minifier.name);
    }
  };

  for (const filename of input) {
    await benchmark(filename);
  }

  process.stderr.write('\n');

  for (const minifier of activeMinifiers) {
    minifier.total = storage.total(minifier.name);
  }

  output(processedFiles, activeMinifiers);
};

module.exports = bench;
