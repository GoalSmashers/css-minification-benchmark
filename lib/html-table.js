'use strict';

const { benchmarkInfo } = require('./benchmark-info.js');

const htmlTable = ({ data }, gzip) => {
  const rows = [];

  const tableRow = (columns, tag) => {
    const endTag = tag.replace('<', '</');
    const body = [];
    body.push('<tr>');

    for (const value of columns) {
      if (typeof value === 'string') {
        body.push(tag + value + endTag);
      } else if (value.value) {
        body.push(tag.replace('>', ` class="${value.class}">`) + value.value + endTag);
      } else {
        const size = `<span class="badge bg-${value.sizeClass}">${value.size}</span>`;
        const time = `<span class="badge bg-${value.timeClass}">${value.time}</span>`;
        body.push(`${tag + size}<br>${time}${endTag}`);
      }
    }

    body.push('</tr>');
    return body.join('\n');
  };

  const buildPage = () => {
    const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CSS minification benchmark results${gzip ? ' (gzip)' : ''}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <style>body{font-size:.9rem}.table thead th{text-align:center;vertical-align:middle}.table td{vertical-align:middle}</style>
</head>
<body class="py-3">
  <div class="container-fluid">
    <div class="mt-2 mb-4 text-center">
      <h1 class="h3">CSS Minification Benchmark${gzip ? ' (gzip)' : ''}</h1>
      <nav class="nav justify-content-center">
        <a class="nav-link ${!gzip ? 'active' : ''}" ${!gzip ? 'aria-current="page"' : ''} href="index.html">Results</a>
        <a class="nav-link ${gzip ? 'active' : ''}" ${gzip ? 'aria-current="page"' : ''} href="index-uncompressed.html">Uncompressed results</a>
        <a class="nav-link" href="https://github.com/GoalSmashers/css-minification-benchmark" title="View the GitHub repository">GitHub</a>
      </nav>
    </div>
    <div class="table-responsive">
      <table class="table table-bordered table-sm table-hover table-striped">
        <thead>
          ${tableRow(data, '<th>')}
        </thead>
        <tbody>
          ${rows.map(row => tableRow(row, '<td>')).join('\n')}
        </tbody>
      </table>
    </div>
    <div class="machine-info my-2">
      <h2 class="h4">Benchmark info:</h2>
      <pre class="bg-light border text-dark p-3">${benchmarkInfo}</pre>
    </div>
  </div>
</body>
</html>`;

    return page;
  };

  return {
    push(row) {
      rows.push(row);
    },

    toString() {
      return buildPage();
    }
  };
};

module.exports = { htmlTable };
