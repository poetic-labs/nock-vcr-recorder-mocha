# Nock VCR Recorder Mocha [![Build Status](https://travis-ci.org/poetic/nock-vcr-recorder-mocha.svg?branch=master)](https://travis-ci.org/poetic/nock-vcr-recorder-mocha)

## About

A wrapper around
[nock-vcr-recorder](https://github.com/poetic/nock-vcr-recorder) to simplify
creating vcr cassettes in mocha.

## Install

```bash
npm install --save-dev nock-vcr-recorder-mocha
```

## Usage

When you need to record cassettes you can either:

- Use `vcr.describe` instead of `describe`
- Use `vcr.it` instead of `it`

`vcr.describe` will record a cassette before each test in that block. So
you can have multiple `it`s and it will record any requests within them.

`vcr.it` will record a cassette for one specific test.

They both support `.skip` and `.only` as mocha does.

```js
var request = require('request');
var assert  = require('assert');
var vcr     = require('nock-vcr-recorder-mocha');

describe('normal test', function() {
  vcr.it.only('works', function(done) {
    request('http://localhost:4000/users', function(err, res, body) {
      assert(!err, 'was success');
      done();
    });
  });

  it('some other test', function() {
    // You can use mocha how you normally would to group tests
  });
});

vcr.describe.skip('skipped test', function() {
  // Anything in here will be skipped
  // If the skip is removed, this request would be recorded for playback in
  // later tests
  it('makes request', function(done) {
    request('http://localhost:4000/users', function(err, res, body) {
      assert(!err, 'was success');
      done();
    });
  });
});
```

## Configuration

List of [available configuration
options](https://github.com/poetic/nock-vcr-recorder#configuration)

#### Test specific configuration

```js
vcr.it('works', {
  mode: 'all'
}, function(done) {
  request('http://localhost:4000/users', function(err, res, body) {
    assert(!err, 'was success');
    done();
  });
});

vcr.describe('works', { mode: 'all' }, function() {
  it('makes request', function(done) {
    request('http://localhost:4000/users', function(err, res, body) {
      assert(!err, 'was success');
      done();
    });
  });
});
```

#### Global Configuration

A `vcr.config` method is exposed to set default configuration on a global level.
This should be done before any of your tests have run. In mocha you can put this
in a helper file.

```js
var vcr = require('nock-vcr-recorder-mocha');

ncr.config({
  excludeScope: ['github.com']
});
```

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

