'use strict';

const { table } = require('table');
const HTMLTable = require('./html-table.js');
const formatRow = require('./format-row.js');
const benchmarkInfo = require('./benchmark-info.js');

const write = (processedFiles, activeMinifiers, asHTML, measureGzip, filter) => {
  if (!asHTML) {
    process.stdout.write('\n');
  }

  const data = [...activeMinifiers].map(minifier => {
    if (asHTML && minifier.url) {
      return `<a href="${minifier.url}">${minifier.name} - ${minifier.version}</a>`;
    }

    return `${minifier.name} - ${minifier.version}`;
  });

  // this is needed for the table's first `th`
  data.unshift('File');

  const results = asHTML ? HTMLTable({ data }) : [data];
  let totalLength = 0;

  for (const filename of Object.keys(processedFiles)) {
    const fileSizeKey = filter === 'gzip' ? 'gzip' : 'size';
    const fileSize = processedFiles[filename][fileSizeKey];
    const size = asHTML ? ` - <em>${fileSize} bytes</em>` : ` - ${fileSize} bytes`;

    totalLength += fileSize;

    const row = [filename + size];

    for (const minifier of activeMinifiers) {
      row.push(formatRow(asHTML, minifier.results[filename], measureGzip, filter));
    }

    results.push(row);
  }

  const totalRow = [`${asHTML ?
    `<span class="text-uppercase fw-bold">Total</span> - <em>${totalLength} bytes</em>` :
    `TOTAL - ${totalLength} bytes`}`];

  for (const minifier of activeMinifiers) {
    totalRow.push(formatRow(asHTML, minifier.total, measureGzip, filter));
  }

  results.push(totalRow);

  if (asHTML) {
    process.stdout.write(results.toString());
  } else {
    process.stdout.write(table(results));
    process.stdout.write(`\n${benchmarkInfo}`);
  }

  process.stdout.write('\n');
};

module.exports.getOutput = (asHTML, measureGzip) => {
  return (files, results) => {
    write(files, results, asHTML, measureGzip, measureGzip ? 'gzip' : 'size');
  };
};
