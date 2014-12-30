// mock it to drop output from ncss
var output = process.stdout.write.bind(process.stdout);
process.stdout.write = function() {};

require('colors');

var Table = require('cli-table');
var HTMLTable = require('./html-table');
var formatRow = require('./format-row');

var lineBreak = require('os').EOL;
var tableHeadings = {
  'size': 'File size',
  'time': 'Time',
  'gzip': 'Gzip size'
};

var write = function (processedFiles, activeMinifiers, asHTML, measureGzip, showTotal, filter) {
  output(lineBreak);

  var minifierNames = activeMinifiers.slice(0).map(function (minifier) {
    if (asHTML && minifier.url)
      return '<a href="' + minifier.url + '">' + minifier.name + ' - ' + minifier.version + '</a>';
    else
      return minifier.name + ' - ' + minifier.version;
  });
  minifierNames.unshift(tableHeadings[filter] || '');

  var tableClass = asHTML ? HTMLTable : Table;
  var results = new tableClass({ head: minifierNames });
  var totalLength = 0;

  Object.keys(processedFiles).forEach(function (filename) {
    var fileSize = processedFiles[filename].size;
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
      ('<em>' + totalLength + ' bytes</em>') :
      (totalLength + ' bytes')
    )];
    activeMinifiers.forEach(function(minifier) {
      totalRow.push(formatRow(asHTML, minifier.total, measureGzip, filter));
    });

    results.push(totalRow);
  }

  output(results.toString());
  output(lineBreak);

};

exports.getOutput = function (asHTML, measureGzip, total, verbose) {
  return function (files, results) {
    if (verbose) {
      ['time', 'size'].forEach(function (filter) {
        write(files, results, asHTML, measureGzip, total, filter);
      });
      if (measureGzip) {
        write(files, results, asHTML, measureGzip, total, 'gzip');
      }
    } else {
      write(files, results, asHTML, measureGzip, total);
    }
  };
};