'use strict';

var RSVP        = require('rsvp');
var path        = require('path');
var vcr         = require('nock-vcr-recorder');
var wrapMochaFn = require('./wrap-mocha-fn');
var slug        = require('slug');

module.exports = wrapMochaFn(describe, function(name, options, callback) {
  callback.call(this);

  var resolve, reject, recorder;
  beforeEach(function() {
    var promise = new RSVP.Promise(function(_resolve, _reject) {
      resolve = _resolve;
      reject  = _reject;
    });

    var cassette = getCassetteName(this);
    recorder = vcr.useCassette(cassette, options || {}, function() {
      return promise;
    });
  });

  afterEach(function() {
    var failed = this.currentTest.state === 'failed';

    if (failed) {
      reject(failed)
    } else {
      resolve();
    }

    return recorder;
  });
});

function getCassetteName(ctx) {
  var parent      = ctx.currentTest.parent;
  var cassettePath = [];
  while(parent.title) {
    cassettePath.unshift(parent.title);
    parent = parent.parent;
  }
  cassettePath.push(ctx.currentTest.title);

  return path.join.apply(path, cassettePath.map(function(pathPiece) {
    return slug(pathPiece).toLowerCase();
  }));
}
