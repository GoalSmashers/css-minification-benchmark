var Measure = require('./measure');

var allResults = {};
var totals = {};

var comparator = function(a, b) {
  return a[this.key] > b[this.key] ? 1 : -1;
};

var compareResult = function (result, against) {
  var compare = {};

  result.each(function (key) {
    compare[key] = {
      best: false,
      worst: false
    };

    var sorted = against.slice().sort(comparator.bind({ key: key }));
    var howMany = sorted.length;

    if (howMany > 1 && result.equal(key, sorted[howMany - 1]) && !result.equal(key, sorted[0]))
      compare[key].worst = true;
    if (howMany && result.equal(key, sorted[0]))
      compare[key].best = true;
  });

  return compare;
};

exports.save = function (file, minifier, stats) {
  if (!allResults[file])
    allResults[file] = {};

  allResults[file][minifier] = new Measure(stats);

  if (!totals[minifier])
    totals[minifier] = new Measure(stats);
  else
    totals[minifier].add(stats);
};

exports.get = function (file, minifier) {
  var against = [];
  for (var name in allResults[file]) {
    var value = allResults[file][name];
    if (value.isValid())
      against.push(value);
  }

  var result = allResults[file][minifier];

  return {
    value: result,
    compare: compareResult(result, against)
  };
};

exports.total = function (minifier) {
  var against = [];
  for (var name in totals) {
    var value = totals[name];
    if (value.isValid())
      against.push(value);
  }
  var result = totals[minifier];

  return {
    value: result,
    compare: compareResult(result, against)
  };
};
