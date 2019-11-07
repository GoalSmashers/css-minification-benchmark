const os = require('os');

const info = {
  'CPU': `${os.cpus()[0].model}`,
  'OS': `${os.type()} ${os.arch()} ${os.release()}`,
  'Node.js': process.version
};

function getMachineInfo() {
  let infoStr = '';

  Object.keys(info).forEach(key => {
    infoStr += `${key}: ${info[key]}\n`;
  });

  return infoStr.trim();
}

module.exports = getMachineInfo;
