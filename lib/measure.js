function isFloat(n) {
  return n === Number(n) && n !== (n | 0);
}

const metrics = ['label', 'time', 'size', 'gzip', 'originalsize', 'originalgzip'];

class Measure {
  constructor(stats) {
    this.each(function (key) {
      this[key] = stats ? stats[key] : Number.NaN;
    });
  }

  each(fn) {
    metrics.forEach(fn, this);
  }

  add(stats) {
    this.each(function (key) {
      this[key] += stats ? stats[key] : Number.NaN;
    });
  }

  isValid() {
    return ('time' in this) && !Number.isNaN(this.time);
  }

  equal(key, measure) {
    return this[key] === measure[key];
  }

  format(key, type) {
    let value = this[key];
    if (isFloat(value))
      value = Number(value.toFixed(2));

    if (type === 'byte')
      return `${value} bytes`;
    if (type === 'time')
      return `${value} ms`;
  }
}

module.exports = Measure;
