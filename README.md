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

// Usage with test specific options
describeFixture('normal test', {
  excludeScope: 'github.com',
  recorder: {
    output_objects: false,
    enable_reqheaders_recording: true
  }
}, function() {
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
```

## Configuration

Defaults:

```js
{
  // Don't record any requests to this scope
  excludeScope: 'localhost',

  // Re-record and overwrite your current fixtures
  overwrite: false,

  // Record fixtures when test fails
  recordOnFailure: false,

  // These options are passed to the nock recorder that runs behind the scenes
  // to capture requests
  recorder: {
    output_objects:  true,
    dont_print:      true
  }
}
```

To overide these you can call `describeFixture.setDefaults` with an object to
override them for ALL tests. It must be called before any `describeFixture()` is
called to work properly. The best place is in a test helper file.

You also are able to pass in test specific options as the last parameter to
`describeFixture()`. See the "Usage" section above for an example.


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

