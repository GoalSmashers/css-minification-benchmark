module.exports = function(options) {
  var head = options.head;
  var rows = [];

  var tableRow = function(columns, tag, index) {
    var startTag = index % 2 === 0 ?
      tag.replace(/>$/, ' style="background-color:#eee">') :
      tag;
    var endTag = tag.replace(/^</, '</');
    var body = [];
    body.push('<tr>');
    columns.forEach(function(value) {
      body.push(startTag + value + endTag);
    });
    body.push('</tr>');
    return body.join('\n');
  };

  var buildPage = function() {
    var page = [];
    page.push('<!DOCTYPE html>');
    page.push('<html>');
    page.push('<head>');
    page.push('<meta charset="utf-8">');
    page.push('<title>css-minification-benchmark results</title>');
    page.push('<style>body{font-family:sans-serif}table{border-collapse:collapse;border-spacing:0}th,td{padding:3px}.green,.red{font-weight:700}.green{color:#0b0}.red{color:red}</style>');
    page.push('</head>');
    page.push('<body>');
    page.push('<table border="1">');
    page.push('<thead>' + tableRow(head, '<th>', 0) + '</thead>');
    page.push('<tbody>');
    rows.forEach(function(row, index) {
      page.push(tableRow(row, '<td>', index + 1));
    });
    page.push('</tbody>');
    page.push('</table>');
    page.push('</body>');
    page.push('</html>');
    return page.join('\n');
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
