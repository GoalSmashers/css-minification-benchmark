[![devDependency Status](https://david-dm.org/GoalSmashers/css-minification-benchmark/dev-status.svg)](https://david-dm.org/GoalSmashers/css-minification-benchmark#info=devDependencies)

## What is css-minification-benchmark?

A comparison of CSS minification engines.

## FAQ

### Which engines are covered?

* [clean-css](https://github.com/GoalSmashers/clean-css)
* [css-condense](https://github.com/rstacruz/css-condense)
* [csso](https://github.com/css/csso)
* [cssshrink](https://github.com/stoyan/cssshrink)
* [ncss](https://github.com/kurakin/ncss)
* [sqwish](https://github.com/ded/sqwish)
* [ycssmin](https://github.com/yui/ycssmin)

### What are the results?

Most of the time either `clean-css` or `csso` comes first. Although it depends on a particular CSS file.

### How can I see the results?

Clone the repository first then run `./bin/bench`. That's it!

Note that on Windows you will need to do `node ./bin/bench`

If you prefer to see results without cloning the repo here are [the most recent ones](http://goalsmashers.github.io/css-minification-benchmark/).

### How can I test my CSS file?

Just copy your file to `data` directory (make sure filename ends with `.css`) and re-run the benchmark.

Please make sure your file does not contain any special comments (`/*! ... */`) since not all minifiers strip them correctly:
* `clean-css` has it configurable but leaves all by default
* `csso` always leaves one
* `ncss` and `ycssmin` always leave all

### How can I add a new minifier to the list?

* add it to `package.json` as a `devDependency`
* run `npm install`
* require it in `bin/bench` and add it to `minifiers` hash
* re-run the benchmark
* add it to this file in "Which engines are covered?" section above
* send a PR (if you wish to have it included)

### How can I compare a subset of minifiers

Just run `./bin/bench --only ncss,ycssmin` (it's turned into `/.*(ncss|ycsmin).*/` regex)

## License

css-minification-benchmark is released under the [MIT License](https://github.com/GoalSmashers/clean-css/blob/master/LICENSE).
