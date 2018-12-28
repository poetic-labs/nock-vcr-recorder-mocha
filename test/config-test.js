'use strict';

var assert     = require('assert');
var request    = require('request');
var vcr        = require('../');
var realVcr    = require('nock-vcr-recorder');
var slug       = require('slug');

describe('config', function() {
  it('changes realVcr\'s default config', function() {
    assert.strictEqual(realVcr._config.cassetteLibraryDir, 'cassettes');

    vcr.config({ cassetteLibraryDir: 'fixtures' });

    assert.strictEqual(realVcr._config.cassetteLibraryDir, 'fixtures');
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
    var cassette = readCassette(slug('config - describe') + '/' + slug('excludes github'));

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
    var cassette = readCassette(slug('config - it') + '/' + slug('excludes github'));

    assert.strictEqual(cassette.length, 0);
  });
});

