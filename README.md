[![Build Status](https://github.com/GoalSmashers/css-minification-benchmark/workflows/Tests/badge.svg)](https://github.com/GoalSmashers/css-minification-benchmark/actions?workflow=Tests)
[![devDependency Status](https://img.shields.io/david/dev/GoalSmashers/css-minification-benchmark.svg)](https://david-dm.org/GoalSmashers/css-minification-benchmark?type=dev)

## What is css-minification-benchmark?

A comparison of CSS minification engines.

## FAQ

### Which engines are covered?

* [clean-css](https://github.com/GoalSmashers/clean-css)
* [crass](https://github.com/mattbasta/crass)
* [cssnano](https://github.com/ben-eb/cssnano)
* [csso](https://github.com/css/csso)
* [csswring](https://github.com/hail2u/node-csswring)

### What are the results?

Most of the time `crass` comes first although `clean-css`, `cssnano` and `csso` come close. Test the minifiers with your CSS to find what works best for you.

### How can I see the results?

Clone the repository, install the dependencies with `npm install` and then run `node ./bin/bench`. That's it!

If you prefer to see results without cloning the repo here are [the most recent ones](https://goalsmashers.github.io/css-minification-benchmark/).

### How can I generate the html report?

Just run `node ./bin/bench --html > report.html`

### How can I test my CSS file?

Just copy your file to the `data` directory (make sure the filename ends with `.css`) and re-run the benchmark.

### How can I add a new minifier to the list?

* add it to `package.json` as a `devDependency`
* run `npm install`
* require it in `lib/minify.js` and add it to `minifiers` hash
* run `npm run bench`
* add it to this file in "Which engines are covered?" section above
* send a PR (if you wish to have it included)

### How can I compare a subset of minifiers?

Just run `node ./bin/bench --only csso,cssnano` (it's turned into `/.*(csso|cssnano).*/` regex)

### Can I get the compressed gzip size as well?

Run `node ./bin/bench --gzip` to measure the gzip size instead of the regular file size.

## License

css-minification-benchmark is released under the [MIT License](https://github.com/GoalSmashers/css-minification-benchmark/blob/master/LICENSE).
