var record   = require('./recorder');
var assert   = require('assert');
var defaults = require('lodash-node/modern/objects/defaults');

function describeFixture(name, callback, options, filter) {
  assert(name, 'name should be defined');
  assert(callback, 'callback should be defined');

  var describeFn = describe;

  var recordOptions = defaults(options || {}, {
    excludeScope: 'localhost'
  });

  // Defaults does not recursively check so we need to explicitly check the
  // record options and set defaults
  recordOptions.recorder = defaults(recordOptions.recorder || {}, {
    output_objects:  true,
    dont_print:      true
  });

  if (filter) {
    describeFn = describeFn[filter];
  }

  return describeFn(name, function() {
    callback.call(this);
    record(name, recordOptions);
  });
}

describeFixture.only = function(name, callback, options) {
  return describeFixture(name, callback, options, 'only')
}

describeFixture.skip = function(name, callback, options) {
  return describeFixture(name, callback, options, 'skip')
}

module.exports = describeFixture;
