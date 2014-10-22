# Mocha Nock Fixtures [![Build Status](https://travis-ci.org/poetic/mocha-nock-fixtures.svg?branch=master)](https://travis-ci.org/poetic/mocha-nock-fixtures)

## About

A simple library that makes saving fixtures with
[nock](https://github.com/pgte/nock) and
[mocha](http://visionmedia.github.io/mocha/) easy. Just
use `describeFixture` instead of `describe` and it will record outbound requests
using nock into `test/fixtures` and read from them the next time you run the
tests.

## Install

```bash
npm install --save-dev mocha-nock-fixtures
```

## Usage

Use `describeFixture` instead of `describe` and it will use nock to record all
requests into your `test/fixtures` directory. It also supports `.skip` and
`.only` as mocha does.

```js
var request         = require('request');
var assert          = require('assert');
var describeFixture = require('mocha-nock-fixtures');

describeFixture('normal test', function() {
  it('works', function(done) {
    request('http://localhost:4000/users', function(err, res, body) {
      assert(!err, 'was success');
      done();
    });
  });

  describe('some other test', function() {
    // You can use mocha how you normally would to group tests
  });
});

describeFixture.skip('skipped test', function() {
  // Anything in here will be skipped
});

describeFixture.only('only test', function() {
  // This will be the only test run
});
```

## Configuration

`NOCK_RECORD` - default: false -  When true it will re-record all
of your fixtures and save over them.

`NOCK_RECORD_ON_FAILURE` - default: false - When true it will record fixtures even when your test fails.

## Authors ##

* [Jake Craige](http://twitter.com/jakecraige)

## Versioning

This library follows [Semantic Versioning](http://semver.org)

## Want to help?

Please do! We are always looking to improve this library. If you have any ideas
please open an issue or a pull requests and we'll work on getting them in.

## Legal

[Poetic Systems](http://poeticsystems.com), Inc &copy; 2014

[@poeticsystems](http://twitter.com/poeticsystems)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)

