module.exports = function(options) {
  var head = options.head;
  var rows = [];

  var lineBreak = require('os').EOL;

  var tableRow = function(columns, tag) {

    var endTag = tag.replace(/^</, '</');
    var body = [];
    body.push('<tr>');
    columns.forEach(function(value) {
      if (typeof value == 'string')
        body.push(tag + value + endTag);
      else {
        if (value.value) {
          body.push(tag.replace('>', ' class="' + value.class + '">') + value.value + endTag);
        }
        else {
          var lines = [];
          if (value.size) lines.push('<span class="label label-' + value.sizeClass + '">' + value.size + '</span>');
          if (value.time) lines.push('<span class="label label-' + value.timeClass + '">' + value.time + '</span>');
          var percentage = value.differential;
          if (percentage) lines.push('<span class="label label-' + percentage.valueClass + '">' + percentage.value + '</span>');
          body.push(tag + lines.join('<br>') + endTag);
        }
      }
    });
    body.push('</tr>');
    return body.join(lineBreak);
  };

  var table = function() {
    var page = [];
    page.push('<div class="table-responsive">');
    page.push('<table class="table table-bordered table-condensed table-hover table-striped">');
    page.push('<thead>' + tableRow(head, '<th>') + '</thead>');
    page.push('<tbody>');
    rows.forEach(function(row) {
      page.push(tableRow(row, '<td>'));
    });
    page.push('</tbody>');
    page.push('</table>');
    page.push('</div>');
    return page.join(lineBreak);
  };

  var open = function () {
    var page = [];
    page.push('<!DOCTYPE html>');
    page.push('<html lang="en">');
    page.push('<head>');
    page.push('<meta charset="utf-8">');
    page.push('<title>css-minification-benchmark results</title>');
    page.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
    page.push('<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">');
    page.push('<style>th{text-align:center;vertical-align:middle!important}</style>');
    page.push('</head>');
    page.push('<body>');
    return page.join(lineBreak);
  };

  var close = function () {
    var page = [];
    page.push('</body>');
    page.push('</html>');
    return page.join(lineBreak);
  };

  return {
    push: function(row) {
      rows.push(row);
    },

    toString: function() {
      return open() + table() + close();
    },

    open: function () {
      return open();
    },

    close: function () {
      return close();
    },

    body: function () {
      return table();
    }
  };
};
