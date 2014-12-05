'use strict';

var assert     = require('assert');
var request    = require('request');
var RSVP       = require('rsvp');
var vcr        = require('../');
var realVcr    = require('nock-vcr-recorder');

describe('config', function() {
  it('changes realVcr\'s default config', function() {
    assert.equal(realVcr._config.cassetteLibraryDir, 'cassettes');

    vcr.config({ cassetteLibraryDir: 'fixtures' });

    assert.equal(realVcr._config.cassetteLibraryDir, 'fixtures');
  });

  after(function() {
    // Reset to not affect other tests
    vcr.config({ cassetteLibraryDir: 'cassettes' });
  });
});

vcr.describe('config - describe', {
  excludeScope: ['github.com']
}, function() {
  it('excludes github', function(done) {
    request('https://github.com/poetic.json', done);
  });

  after(function() {
    var cassette = readCassette('config - describe/excludes github');

    assert.equal(cassette.length, 0);
  });
});

describe('config - it', function() {
  vcr.it('excludes github', {
    excludeScope: ['github.com']
  }, function(done) {
    request('https://github.com/poetic.json', done);
  });

  after(function() {
    var cassette = readCassette('config - it/excludes github');

    assert.equal(cassette.length, 0);
  });
});

