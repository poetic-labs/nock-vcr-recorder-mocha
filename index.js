'use strict';

var vcr      = require('nock-vcr-recorder');
var describe = require('./lib/describe');
var it       = require('./lib/it');

module.exports = {
  describe:  describe,
  it:        it,
  config:    vcr.config.bind(vcr)
}
