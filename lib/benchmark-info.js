const os = require('os');

const info = `Date: ${new Date().toUTCString()}
CPU: ${os.cpus()[0].model}
OS: ${os.type()} ${os.arch()} ${os.release()}
Node.js: ${process.version}`;

module.exports = info;
