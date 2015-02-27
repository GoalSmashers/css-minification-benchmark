function isFloat (n) {
  return n === +n && n !== (n|0);
}

var metrics = ['label', 'time', 'size', 'gzip', 'originalsize', 'originalgzip'];
var Measure = function (stats) {
  this.each(function (key) {
    this[key] = stats ? stats[key] : NaN;
  });
};

Measure.prototype.each = function (fn) {
  metrics.forEach(fn, this);
};

Measure.prototype.add = function (stats) {
  this.each(function (key) {
    this[key] += stats ? stats[key] : NaN;
  });
};

Measure.prototype.isValid = function () {
  return ('time' in this) && !isNaN(this.time);
};

Measure.prototype.equal = function (key, measure) {
  return this[key] == measure[key];
};

Measure.prototype.format = function (key, type) {
  var value = this[key];
  if (isFloat(value))
    value = Number(value.toFixed(2));

  if (type === 'byte')
    return value + ' bytes';
  if (type === 'time')
    return value + ' ms';
};

module.exports = Measure;
