[![Linux Build Status](https://img.shields.io/travis/GoalSmashers/css-minification-benchmark.svg)](https://travis-ci.org/GoalSmashers/css-minification-benchmark)
[![devDependency Status](https://img.shields.io/david/dev/GoalSmashers/css-minification-benchmark.svg)](https://david-dm.org/GoalSmashers/css-minification-benchmark?type=dev)

## What is css-minification-benchmark?

A comparison of CSS minification engines.

## FAQ

### Which engines are covered?

* [clean-css](https://github.com/GoalSmashers/clean-css)
* [crass](https://github.com/mattbasta/crass)
* [css-condense](https://github.com/rstacruz/css-condense)
* [cssnano](https://github.com/ben-eb/cssnano)
* [csso](https://github.com/css/csso)
* [cssshrink](https://github.com/stoyan/cssshrink)
* [csswring](https://github.com/hail2u/node-csswring)
* [more-css](https://github.com/army8735/more)
* [sqwish](https://github.com/ded/sqwish)
* [ycssmin](https://github.com/yui/ycssmin)

### What are the results?

Most of the time `more-css` comes first although `clean-css` and `csso` come close. Test the minifiers with your CSS to find what works best for you.

### How can I see the results?

Clone the repository first then run `./bin/bench`. That's it!

Note that on Windows you will need to do `node ./bin/bench`

If you prefer to see results without cloning the repo here are [the most recent ones](https://goalsmashers.github.io/css-minification-benchmark/).

### How can I generate the html report?

Just run `./bin/bench --html > report.html`

### How can I test my CSS file?

Just copy your file to the `data` directory (make sure the filename ends with `.css`) and re-run the benchmark.

Please make sure your file does not contain any special comments (`/*! ... */`) since not all minifiers strip them correctly:

* `clean-css` is configurable, but leaves all by default
* `csso` always leaves one
* `ycssmin` always leave all

### Can I get the total size and time for my CSS files?

Copy all your files to the `data` directory like before and run the benchmark with `--total`.

### How can I add a new minifier to the list?

* add it to `package.json` as a `devDependency`
* run `npm install`
* require it in `lib/minify.js` and add it to `minifiers` hash
* run `npm run bench`
* add it to this file in "Which engines are covered?" section above
* send a PR (if you wish to have it included)

### How can I compare a subset of minifiers?

Just run `./bin/bench --only csso,ycssmin` (it's turned into `/.*(csso|ycsmin).*/` regex)

### Can I get the compressed gzip size as well?

Run `./bin/bench --gzip` to measure the gzip size instead of the regular file size.

## License

css-minification-benchmark is released under the [MIT License](https://github.com/GoalSmashers/clean-css/blob/master/LICENSE).
