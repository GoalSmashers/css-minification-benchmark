const fs = require('fs');
const path = require('path');

const CleanCSS = require('clean-css');
const cssnano = require('cssnano');
const csso = require('csso');
const gzipSize = require('gzip-size');
const Q = require('q');

// MINIFIERS
const minifiers = {
  'clean-css': source => {
    return new CleanCSS({ inline: false }).minify(source).styles;
  },
  'clean-css (level 2)': source => {
    return new CleanCSS({ level: 2, inline: false }).minify(source).styles;
  },
  'cssnano': source => {
    return cssnano.process(source, { from: undefined }, { preset: 'default' }).then(result => {
      return result.css;
    });
  },
  'cssnano (advanced)': source => {
    return cssnano.process(source, { from: undefined }, { preset: 'advanced' }).then(result => {
      return result.css;
    });
  },
  'csso': source => {
    return csso.minify(source).css;
  },
  'csso (restructure off)': source => {
    return csso.minify(source, { restructure: false }).css;
  }
};

const gzippedSize = {};

function getMinifierInfo(name) {
  const packageName = name.split(' ')[0];
  const packageDefinition = JSON.parse(fs.readFileSync(path.join('node_modules', packageName, 'package.json')));
  let repositoryUrl;
  if (packageDefinition.repository && packageDefinition.repository.url) {
    repositoryUrl = packageDefinition.repository.url
      .replace(/^git:\/\/|^git\+https:\/\/|^git\+ssh:\/\/git@/, 'https://')
      .replace(/\.git$/, '');
  }

  if (!repositoryUrl) {
    repositoryUrl = packageDefinition.homepage;
  }

  const { version } = packageDefinition;

  return {
    name,
    version,
    url: repositoryUrl,
    results: {}
  };
}

const getActive = only => {
  const activeMinifiers = [];
  for (const name in minifiers) {
    if (only.test(name))
      activeMinifiers.push(getMinifierInfo(name));
  }

  return activeMinifiers;
};

const measure = (minifierName, source, gzip) => {
  const start = process.hrtime();
  const maybeMinified = minifiers[minifierName](source);
  return Q(maybeMinified).then(minified => {
    const itTook = process.hrtime(start);
    const took = Math.round((1000 * itTook[0] + itTook[1] / 1000000) * 100) / 100;
    if (gzip && !gzippedSize[source])
      gzippedSize[source] = gzipSize.sync(source);

    return {
      time: took,
      size: minified.length,
      gzip: gzip ? gzipSize.sync(minified) : Number.NaN,
      originalsize: source.length,
      originalgzip: gzippedSize[source]
    };
  });
};

module.exports = {
  getActive,
  measure
};
