const os = require('os');

const info = {
  'CPU': `${os.cpus()[0].model}`,
  'OS': `${os.type()} ${os.arch()} ${os.release()}`,
  'Node.js': process.version
};

module.exports = info;
