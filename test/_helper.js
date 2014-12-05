'use strict';

var fs     = require('fs');
var path   = require('path');
var assert = require('assert');

global.assertCassette = function assertCassette(name) {
  assert(fs.existsSync(cassettePath(name)),
         'cassette "' + name + '" should exist');
}

global.assertNotCassette = function assertNotCassette(name) {
  assert(!fs.existsSync(cassettePath(name)),
         'cassette "' + name + '" should exist');
}

global.cassettePath = function cassettePath(name) {
  return path.resolve(
    path.join('cassettes', name + '.json')
  );
}


global.readCassette = function readCassette(name) {
  return JSON.parse(
    fs.readFileSync(cassettePath(name), { encoding: 'utf8' })
  );
}
