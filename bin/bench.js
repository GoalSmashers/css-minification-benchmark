#!/usr/bin/env node

'use strict';

const fs = require('fs');
const { processOutput } = require('../lib/process-output.js');
const bench = require('../lib/index.js');

// ARGUMENTS
const only = process.argv.includes('--only') ?
  new RegExp(`.*(${process.argv[process.argv.indexOf('--only') + 1].replace(/,/g, '|')}).*`) :
  /.+/;
const asHTML = process.argv.includes('--html');
const gzip = process.argv.includes('--gzip');
const output = processOutput(asHTML, gzip);

const input = fs.readdirSync('data');

bench({ only, asHTML, gzip }, input, output);
