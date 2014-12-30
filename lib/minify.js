var CleanCSS = require('clean-css');
var cssCondense = require('css-condense');
var csso = require('csso');
var cssshrink = require('cssshrink');
var csswring = require('csswring');
var moreCss = require('more-css');
var ncss = require('ncss');
var sqwish = require('sqwish');
var ycssmin = require('ycssmin');

var gzipSize = require('gzip-size');

// MINIFIERS
var minifiers = {
'clean-css': function(source) {
  return new CleanCSS({ processImport: false }).minify(source).styles;
},
'clean-css (advanced off)': function(source) {
  return new CleanCSS({ advanced: false, processImport: false }).minify(source).styles;
},
'css-condense': function(source) {
  return cssCondense.compress(source, { safe: true });
},
'csso': csso.justDoIt,
'csso (reordering off)': function(source) {
  return csso.justDoIt(source, true);
},
'cssshrink': cssshrink.shrink,
'csswring': function (source) {
  return csswring.wring(source).css;
},
'more-css': function(source) {
  return moreCss.compress(source, true);
},
'ncss': ncss,
'sqwish': sqwish.minify,
'ycssmin': ycssmin.cssmin
};

exports.getActive = function (only) {
  var activeMinifiers = [];
  for (var name in minifiers) {
    if (only.test(name))
      activeMinifiers.push(name);
  }
  return activeMinifiers;
};

exports.measure = function (minifierName, source, gzip) {
  var start = process.hrtime();
  var minified = minifiers[minifierName](source);
  var itTook = process.hrtime(start);
  var took = Math.round((1000 * itTook[0] + itTook[1] / 1000000) * 100) / 100;
  var gzipped = gzip ? gzipSize.sync(minified) : NaN;

  return {
    time: took,
    original: source.length,
    size: minified.length,
    gzip: gzipped
  };
};