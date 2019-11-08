const os = require('os');

const date = new Date();

const info = {
  'Date': `${date.toUTCString()}`,
  'CPU': `${os.cpus()[0].model}`,
  'OS': `${os.type()} ${os.arch()} ${os.release()}`,
  'Node.js': process.version
};

function getInfo() {
  return (Object.keys(info).map(key => `${key}: ${info[key]}\n`)).join('').trim();
}

module.exports = getInfo;
