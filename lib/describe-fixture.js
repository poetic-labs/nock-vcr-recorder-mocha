
var record = require('./recorder');
var assert = require('assert');

function describeFixture(name, callback, options) {
  assert(name, 'name should be defined');
  assert(callback, 'callback should be defined');

  var describeFn = describe;

  var options = options || {};
  var filter = (options.hasOwnProperty('filter')) ? options.filter : false;

  if (filter) {
    describeFn = describeFn[filter];
  }

  return describeFn(name, function() {
    callback.call(this);

    record(name, options);
  });
}

describeFixture.only = function(name, callback) {
  return describeFixture(name, callback, 'only')
}

describeFixture.skip = function(name, callback) {
  return describeFixture(name, callback, 'skip')
}

module.exports = describeFixture;
