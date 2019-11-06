const machineInfo = require('./machine-info');

module.exports = ({ data }) => {
  const rows = [];
  const lineBreak = '\n';

  const tableRow = (columns, tag) => {
    const endTag = tag.replace(/^</, '</');
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
    return body.join(lineBreak);
  };

  const getMachineInfo = () => {
    let infoStr = '';

    Object.keys(machineInfo).forEach(key => {
      infoStr += `${key}: ${machineInfo[key]}\n`;
    });

    return infoStr.trim();
  };

  const buildPage = () => {
    const page = [];
    page.push('<!doctype html>');
    page.push('<html lang="en">');
    page.push('<head>');
    page.push('<meta charset="utf-8">');
    page.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
    page.push('<title>css-minification-benchmark results</title>');
    page.push('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">');
    page.push('<style>body{font-size:.9rem}.table thead th{text-align:center;vertical-align:middle}.table td{vertical-align:middle}</style>');
    page.push('</head>');
    page.push('<body>');
    page.push('<div class="container-fluid">');
    page.push('<div class="mt-2 mb-4 text-center">');
    page.push('<h1 class="h3">CSS Minification Benchmark</h1>');
    page.push('<a href="https://github.com/GoalSmashers/css-minification-benchmark" title="View the GitHub repository">GitHub</a>');
    page.push('</div>');
    page.push('<div class="table-responsive">');
    page.push('<table class="table table-bordered table-sm table-hover table-striped">');
    page.push(`<thead>${tableRow(data, '<th>')}</thead>`);
    page.push('<tbody>');
    rows.forEach(row => {
      page.push(tableRow(row, '<td>'));
    });
    page.push('</tbody>');
    page.push('</table>');
    page.push('</div>'); // table-responsive
    page.push('<div class="machine-info">');
    page.push('<p class="mb-2">Results were generated on:</p>');
    page.push(`<pre><code>${getMachineInfo()}</code></pre>`);
    page.push('</div>'); // table-responsive
    page.push(`<footer class="text-muted pt-2 pb-3">Page generated on <time datetime="${data.date.iso}">${data.date.human}</time></footer>`);
    page.push('</div>'); // container-fluid
    page.push('</body>');
    page.push('</html>');
    return page.join(lineBreak);
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
