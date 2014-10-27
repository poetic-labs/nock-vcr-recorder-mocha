
var record = require('./recorder');
var assert = require('assert');

function describeFixture(name, callback, options) {
  assert(name, 'name should be defined');
  assert(callback, 'callback should be defined');

  var describeFn = describe;
  var options = options || { dont_print: true };

  if (filter) {
    describeFn = describeFn[filter];
  }

  return describeFn(name, function() {
    callback.call(this);
    record(name, options);
  });
}

describeFixture.only = function(name, callback, options) {
  return describeFixture(name, callback, options, 'only')
}

describeFixture.skip = function(name, callback, options) {
  return describeFixture(name, callback, options, 'skip')
}

module.exports = describeFixture;
