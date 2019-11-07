const Table = require('cli-table');
const HTMLTable = require('./html-table');
const formatRow = require('./format-row');
const machineInfo = require('./machine-info');

const lineBreak = '\n';

const write = (processedFiles, activeMinifiers, asHTML, measureGzip, showTotal, filter) => {
  process.stdout.write(lineBreak);

  const data = activeMinifiers.slice(0).map(minifier => {
    if (asHTML && minifier.url)
      return `<a href="${minifier.url}">${minifier.name} - ${minifier.version}</a>`;
    return `${minifier.name} - ${minifier.version}`;
  });

  // this is needed for the table's first `th`
  data.unshift('File');

  const date = new Date();
  data.date = {
    human: `${date.toUTCString()}`,
    iso: `${date.toISOString()}`
  };

  const results = asHTML ? HTMLTable({ data }) : new Table({ head: data });
  let totalLength = 0;

  Object.keys(processedFiles).forEach(filename => {
    const fileSizeKey = filter === 'gzip' ? 'gzip' : 'size';
    const fileSize = processedFiles[filename][fileSizeKey];
    const size = asHTML ?
      ` - <em>${fileSize} bytes</em>` :
      ` - ${fileSize} bytes`;
    totalLength += fileSize;

    const row = [filename + size];

    activeMinifiers.forEach(minifier => {
      row.push(formatRow(asHTML, minifier.results[filename], measureGzip, filter));
    });

    results.push(row);
  });

  if (showTotal) {
    const totalRow = [`${asHTML ?
      `<span class="text-uppercase font-weight-bold">Total</span> - <em>${totalLength} bytes</em>` :
      `TOTAL - ${totalLength} bytes`}`];
    activeMinifiers.forEach(minifier => {
      totalRow.push(formatRow(asHTML, minifier.total, measureGzip, filter));
    });

    results.push(totalRow);
  }

  if (!asHTML) {
    results.push([`Generated on: ${data.date.iso.replace(/T.+$/g, '')}
${machineInfo()}`]);
  }

  process.stdout.write(results.toString());
  process.stdout.write(lineBreak);
};

module.exports.getOutput = (asHTML, measureGzip, total) => {
  return (files, results) => {
    write(files, results, asHTML, measureGzip, total, measureGzip ? 'gzip' : 'size');
  };
};
