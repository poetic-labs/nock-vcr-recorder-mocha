'use strict';

var assert  = require('assert');
var RSVP    = require('rsvp');
var request = require('request');
var app     = require('./app');
var vcr     = require('../');
var slug    = require('slug');

describe('it', function() {
  before(function(done) {
    app.listen(4006, done);
  });

  vcr.it('slugifies a cassette - callback', function(done) {
    request('http://localhost:4006/test', done);
  });

  vcr.it('slugifies a cassette - Promise', function() {
    return RSVP.denodeify(request)('http://localhost:4006/test');
  });

  it('doesnt save with no requests', function() {
    assert.ok(true);
  });

  after(function() {
    console.log('after');
    assertCassette('it/' + slug('slugifies a cassette - callback'));
    assertCassette('it/' + slug('slugifies a cassette - promise'));
    assertNotCassette(slug('it/doesnt save with no requests'));
  });
});

