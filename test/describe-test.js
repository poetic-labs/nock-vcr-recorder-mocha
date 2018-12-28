'use strict';

var assert  = require('assert');
var RSVP    = require('rsvp');
var request = require('request');
var app     = require('./app');
var vcr     = require('../');
var slug    = require('slug');

vcr.describe('describe', function() {
  before(function(done) {
    this.server = app.listen(4007, done);
  });

  it('slugifies a cassette - callback', function(done) {
    request('http://localhost:4007/test', done);
  });

  it('slugifies a cassette - Promise', function() {
    return RSVP.denodeify(request)('http://localhost:4007/test');
  });

  it('doesnt save with no requests', function() {
    assert.ok(true);
  });

  after(function(done) {
    assertCassette('describe/' + slug('slugifies a cassette - promise'));
    assertCassette('describe/' + slug('slugifies a cassette - callback'));
    assertNotCassette(slug('describe/doesnt save with no requests'));
    this.server.close(done)
  });
});

