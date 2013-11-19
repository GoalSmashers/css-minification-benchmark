module.exports = function(options) {
  var head = options.head;
  var rows = [];

  var lineBreak = process.platform == 'win32' ? '\r\n' : '\n';

  var tableRow = function(columns, tag) {

    var endTag = tag.replace(/^</, '</');
    var body = [];
    body.push('<tr>');
    columns.forEach(function(value) {
      body.push(tag + value + endTag);
    });
    body.push('</tr>');
    return body.join(lineBreak);
  };

  var buildPage = function() {
    var page = [];
    page.push('<!DOCTYPE html>');
    page.push('<html lang="en">');
    page.push('<head>');
    page.push('<meta charset="utf-8">');
    page.push('<title>css-minification-benchmark results</title>');
    page.push('<style>body{font-family:sans-serif}table{border-collapse:collapse;border-spacing:0}th,td{padding:3px}th,tr:nth-child(even){background-color:#eee}.green,.red{font-weight:700}.green{color:#0b0}.red{color:red}</style>');
    page.push('</head>');
    page.push('<body>');
    page.push('<table border="1">');
    page.push('<thead>' + tableRow(head, '<th>') + '</thead>');
    page.push('<tbody>');
    rows.forEach(function(row) {
      page.push(tableRow(row, '<td>'));
    });
    page.push('</tbody>');
    page.push('</table>');
    page.push('</body>');
    page.push('</html>');
    return page.join(lineBreak);
  };

  return {
    push: function(row) {
      rows.push(row);
    },

    toString: function() {
      return buildPage();
    }
  };
};
