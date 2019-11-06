const os = require('os');
const prettyBytes = require('pretty-bytes');

const info = {
  'CPU': `${os.cpus()[0].model}`,
  'Memory (Total / Free)': `${prettyBytes(os.totalmem())} / ${prettyBytes(os.freemem())}`,
  'OS': `${os.type()} ${os.arch()} ${os.release()}`,
  'Node.js': process.version
};

module.exports = info;
