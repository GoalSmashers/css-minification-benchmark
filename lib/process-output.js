var os = require('os');
var Table = require('cli-table');
var HTMLTable = require('./html-table');
var formatRow = require('./format-row');

require('colors');

var lineBreak = os.EOL;

var write = function (processedFiles, activeMinifiers, asHTML, measureGzip, showTotal, filter) {
  process.stdout.write(lineBreak);

  var minifierNames = activeMinifiers.slice(0).map(function (minifier) {
    if (asHTML && minifier.url)
      return '<a href="' + minifier.url + '">' + minifier.name + ' - ' + minifier.version + '</a>';
    else
      return minifier.name + ' - ' + minifier.version;
  });
  minifierNames.unshift('Generated on ' + (new Date().toISOString().replace(/T.+$/g, '')));

  var opts = { head: minifierNames };
  var results = asHTML ? new HTMLTable(opts) : new Table(opts);
  var totalLength = 0;

  Object.keys(processedFiles).forEach(function (filename) {
    var fileSizeKey = filter == 'gzip' ? 'gzip' : 'size';
    var fileSize = processedFiles[filename][fileSizeKey];
    var size = asHTML ?
      ' - <em>' + fileSize + ' bytes</em>' :
      ' - ' + fileSize + ' bytes';
    totalLength += fileSize;

    var row = [filename + size];

    activeMinifiers.forEach(function(minifier) {
      row.push(formatRow(asHTML, minifier.results[filename], measureGzip, filter));
    });

    results.push(row);
  });

  if (showTotal) {
    var totalRow = ['TOTAL - ' + (asHTML ?
      '<em>' + totalLength + ' bytes</em>' :
      totalLength + ' bytes'
    )];
    activeMinifiers.forEach(function(minifier) {
      totalRow.push(formatRow(asHTML, minifier.total, measureGzip, filter));
    });

    results.push(totalRow);
  }

  process.stdout.write(results.toString());
  process.stdout.write(lineBreak);

};

exports.getOutput = function (asHTML, measureGzip, total) {
  return function (files, results) {
    write(files, results, asHTML, measureGzip, total, measureGzip ? 'gzip' : 'size');
  };
};
