var CleanCSS = require('clean-css');
var crass = require('crass');
var cssCondense = require('css-condense');
require('es6-promise').polyfill(); // required for cssnano until node 0.10 is supported
var cssnano = require('cssnano');
var csso = require('csso');
var cssshrink = require('cssshrink');
var csswring = require('csswring');
var moreCss = require('more-css');
var ncss = require('ncss');
var sqwish = require('sqwish');
var ycssmin = require('ycssmin');

var gzipSize = require('gzip-size');
var fs = require('fs');
var path = require('path');
var Q = require('q');

// MINIFIERS
var minifiers = {
  'clean-css': function(source) {
    return new CleanCSS({ processImport: false }).minify(source).styles;
  },
  'clean-css (advanced off)': function(source) {
    return new CleanCSS({ advanced: false, processImport: false }).minify(source).styles;
  },
  'crass': function(source) {
    return '' + crass.parse(source).optimize({ o1: true });
  },
  'crass (o1 off)': function(source) {
    return '' + crass.parse(source).optimize();
  },
  'css-condense': function(source) {
    return cssCondense.compress(source, { safe: true });
  },
  'cssnano': function (source) {
    return cssnano.process(source).then(function (result) {
      return result.css;
    });
  },
  'csso': function(source) {
    return csso.minify(source).css;
  },
  'csso (restructure off)': function(source) {
    return csso.minify(source, { restructure: false }).css;
  },
  'cssshrink': cssshrink.shrink,
  'csswring': function (source) {
    return csswring.wring(source).css;
  },
  'more-css': function(source) {
    var minified = moreCss.compress(source, true);
    if (minified.indexOf('Error: ') === 0)
      throw new Error(minified);

    return minified;
  },
  'ncss': ncss,
  'sqwish': sqwish.minify,
  'ycssmin': ycssmin.cssmin
};

var gzippedSize = {};

function getMinifierInfo (name) {
  var packageName = name.split(' ')[0];
  var packageDefinition = JSON.parse(fs.readFileSync(path.join('node_modules', packageName, 'package.json')));
  var repositoryUrl;
  if (packageDefinition.repository && packageDefinition.repository.url) {
    repositoryUrl = packageDefinition.repository.url
      .replace(/(^git:\/\/)|(^git\+https:\/\/)|(^git\+ssh:\/\/git@)/, 'https://')
      .replace(/\.git$/, '');
  }
  if (!repositoryUrl) {
    repositoryUrl = packageDefinition.homepage;
  }
  var version = packageDefinition.version;

  return {
    name: name,
    version: version,
    url: repositoryUrl,
    results: {}
  };
}

exports.getActive = function (only) {
  var activeMinifiers = [];
  for (var name in minifiers) {
    if (only.test(name))
      activeMinifiers.push(getMinifierInfo(name));
  }
  return activeMinifiers;
};

exports.measure = function (minifierName, source, gzip) {
  var start = process.hrtime();
  var maybeMinified = minifiers[minifierName](source);
  return Q(maybeMinified).then(function (minified) {
    var itTook = process.hrtime(start);
    var took = Math.round((1000 * itTook[0] + itTook[1] / 1000000) * 100) / 100;
    if (gzip && !gzippedSize[source])
      gzippedSize[source] = gzipSize.sync(source);

    return {
      time: took,
      size: minified.length,
      gzip: gzip ? gzipSize.sync(minified) : NaN,
      originalsize: source.length,
      originalgzip: gzippedSize[source]
    };
  });
};
