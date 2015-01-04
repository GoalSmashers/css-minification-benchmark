var allResults = {};
var totals = {};

var comparator = function(a, b) {
  return a[this.key] > b[this.key] ? 1 : -1;
};

var compareResult = function (result, against) {
  var sizes = against.slice().sort(comparator.bind({ key: 'size' }));
  var times = against.slice().sort(comparator.bind({ key: 'time' }));
  var compare = {
    size: {
      best: false,
      worst: false
    },
    time: {
      best: false,
      worst: false
    }
  };

  if (result.size == sizes[sizes.length - 1].size && sizes.length > 1 && sizes[0].size != sizes[sizes.length - 1].size)
    compare.size.worst = true;
  if (result.size == sizes[0].size)
    compare.size.best = true;

  if (result.time == times[times.length - 1].time && times.length > 1 && times[0].time != times[times.length - 1].time)
    compare.time.worst = true;
  if (result.time == times[0].time)
    compare.time.best = true;

  return compare;
};

exports.save = function (file, minifier, size, time) {
  if (!allResults[file])
    allResults[file] = {};

  allResults[file][minifier] = {
    size: size,
    time: time
  };

  if (!totals[minifier])
    totals[minifier] = { size: 0, time: 0 };

  totals[minifier].size += size;
  totals[minifier].time += time;
};

exports.get = function (file, minifier) {
  var against = [];
  for (var name in allResults[file]) {
    var value = allResults[file][name];
    if (!isNaN(value.time))
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
    if (!isNaN(value.time))
      against.push(value);
  }
  var result = totals[minifier];

  return {
    value: {
      size: result.size,
      // Because math with float values is weird
      time: Number(result.time.toFixed(2))
    },
    compare: compareResult(result, against)
  };
};
