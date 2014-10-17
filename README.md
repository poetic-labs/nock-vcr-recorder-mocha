# Mocha Nock Fixtures [![Build Status](https://travis-ci.org/poetic/mocha-nock-fixtures.svg?branch=master)](https://travis-ci.org/poetic/mocha-nock-fixtures)

## About

A simple library that makes saving fixtures with nock and mocha easy. Just
use `describeFixture` isntead of `describe` and it will record outbound requests
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

## Configuration

If you set the environment variable `NOCK_RECORD` to true it will re-record all
of your fixtures and save over them.

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

