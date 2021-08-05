'use strict';

const os = require('os');
const process = require('process');

const benchmarkInfo = `Date: ${new Date().toUTCString()}
CPU: ${os.cpus()[0].model}
OS: ${os.type()} ${os.arch()} ${os.release()}
Node.js: ${process.version}`;

module.exports = { benchmarkInfo };
