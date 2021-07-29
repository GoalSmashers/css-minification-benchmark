const Measure = require('./measure');

const allResults = {};
const totals = {};

const comparator = function (a, b) {
  return a[this.key] > b[this.key] ? 1 : -1;
};

const compareResult = (result, against) => {
  const compare = {};

  result.each(key => {
    compare[key] = {
      best: false,
      worst: false
    };

    const sorted = [...against].sort(comparator.bind({ key }));
    const howMany = sorted.length;

    if (howMany > 1 && result.equal(key, sorted[howMany - 1]) && !result.equal(key, sorted[0]))
      compare[key].worst = true;
    if (howMany && result.equal(key, sorted[0]))
      compare[key].best = true;
  });

  return compare;
};

const save = (file, minifier, stats) => {
  if (!allResults[file])
    allResults[file] = {};

  allResults[file][minifier] = new Measure(stats);

  if (!totals[minifier])
    totals[minifier] = new Measure(stats);
  else
    totals[minifier].add(stats);
};

const get = (file, minifier) => {
  const against = [];
  for (const name in allResults[file]) {
    if (Object.prototype.hasOwnProperty.call(allResults[file], name)) {
      const value = allResults[file][name];
      if (value.isValid())
        against.push(value);
    }
  }

  const result = allResults[file][minifier];

  return {
    value: result,
    compare: compareResult(result, against)
  };
};

const total = minifier => {
  const against = [];
  for (const name in totals) {
    if (Object.prototype.hasOwnProperty.call(totals, name)) {
      const value = totals[name];
      if (value.isValid())
        against.push(value);
    }
  }

  const result = totals[minifier];

  return {
    value: result,
    compare: compareResult(result, against)
  };
};

module.exports = {
  save,
  get,
  total
};
