'use strict';

var RSVP        = require('rsvp');
var path        = require('path');
var vcr         = require('nock-vcr-recorder');
var wrapMochaFn = require('./wrap-mocha-fn');
var slug        = require('slug');

module.exports = wrapMochaFn(it, function(name, options, callback) {
  var testCtx  = this;
  var cassette = getCassetteName(testCtx);

  return vcr.useCassette(cassette, options || {}, function() {
    if (callback.length) { // has a done callback
      return new RSVP.Promise(function(resolve, reject) {
        callback.call(testCtx, function(err) {
          if (err) {
            return reject(err);
          }

          resolve();
        });
      });
    }

    return callback.call(testCtx);
  });
});

function getCassetteName(ctx) {
  var parent      = ctx.test.parent;
  var cassettePath = [];
  if (parent) {
    while(parent.title) {
      cassettePath.unshift(parent.title);
      parent = parent.parent;
    }
  }
  cassettePath.push(ctx.test.title);
  cassettePath = cassettePath.map(function(pathPiece) {
    return slug(pathPiece).toLowerCase();
  });

  return path.join.apply(path, cassettePath);
}
