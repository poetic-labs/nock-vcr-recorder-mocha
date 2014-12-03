var record   = require('./recorder');
var assert   = require('assert');
var defaults = require('lodash-node/modern/objects/defaults');

var defaultConfig = {};

function describeFixture(name, callback, options, filter) {
  assert(name, 'name should be defined');
  assert(callback, 'callback should be defined');

  var describeFn = describe;

  if (filter) {
    describeFn = describeFn[filter];
  }

  return describeFn(name, function() {
    callback.call(this);

    var recordOptions = defaults(options || {}, defaultConfig);

    // Defaults does not recursively check so we need to explicitly check the
    // record options and set defaults
    recordOptions.recorder = defaults(recordOptions.recorder || {},
                                      defaultConfig.recorder);

    record(name, recordOptions);
  });
}

describeFixture.only = function(name, callback, options) {
  return describeFixture(name, callback, options, 'only')
}

describeFixture.skip = function(name, callback, options) {
  return describeFixture(name, callback, options, 'skip')
}

describeFixture.setDefaultConfig = function(newConfig) {
  if (!newConfig) {
    defaultConfig = {
      excludeScope: 'localhost',
      recorder: {
        output_objects:  true,
        dont_print:      true
      }
    }

    return;
  };

  var recorder = defaults(newConfig.recorder || {}, defaultConfig.recorder);
  defaultConfig.recorder = recorder;

  defaultConfig = defaults(newConfig, defaultConfig);
}

describeFixture.setDefaultConfig();

module.exports = describeFixture;
