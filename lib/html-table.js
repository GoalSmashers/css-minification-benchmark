const benchmarkInfo = require('./benchmark-info');

module.exports = ({ data }) => {
  const rows = [];

  const tableRow = (columns, tag) => {
    const endTag = tag.replace('<', '</');
    const body = [];
    body.push('<tr>');
    columns.forEach(value => {
      if (typeof value === 'string') {
        body.push(tag + value + endTag);
      } else if (value.value) {
        body.push(tag.replace('>', ` class="${value.class}">`) + value.value + endTag);
      } else {
        const size = `<span class="badge badge-${value.sizeClass}">${value.size}</span>`;
        const time = `<span class="badge badge-${value.timeClass}">${value.time}</span>`;
        body.push(`${tag + size}<br>${time}${endTag}`);
      }
    });
    body.push('</tr>');
    return body.join('\n');
  };

  const buildPage = () => {
    const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>css-minification-benchmark results</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
  <style>body{font-size:.9rem}.table thead th{text-align:center;vertical-align:middle}.table td{vertical-align:middle}</style>
</head>
<body>
  <div class="container-fluid">
    <div class="mt-2 mb-4 text-center">
      <h1 class="h3">CSS Minification Benchmark</h1>
      <a href="https://github.com/GoalSmashers/css-minification-benchmark" title="View the GitHub repository">GitHub</a>
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
      <pre class="bg-light text-dark p-3">${benchmarkInfo}</pre>
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
