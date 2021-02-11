#!/usr/bin/env node

const fs = require('fs');
const processOutput = require('../lib/process-output');
const bench = require('../lib');

// ARGUMENTS
const only = process.argv.includes('--only') ?
  new RegExp(`.*(${process.argv[process.argv.indexOf('--only') + 1].replace(/,/g, '|')}).*`) :
  /.+/;
const asHTML = process.argv.includes('--html');
const gzip = process.argv.includes('--gzip');
const output = processOutput.getOutput(asHTML, gzip);

const input = fs.readdirSync('data');

bench({ only, asHTML, gzip }, input, output);
