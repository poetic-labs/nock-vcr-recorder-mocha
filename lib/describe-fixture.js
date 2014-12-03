var record   = require('./recorder');
var assert   = require('assert');
var defaults = require('lodash-node/modern/objects/defaults');

var defaultConfig = {};

function describeFixture(name, filter, options, callback) {
  if (arguments.length === 2 && typeof filter === 'function') {
    callback = filter;
    filter   = null;
  } else if (arguments.length === 3 && typeof filter === 'object'
             && typeof options === 'function') {
    callback = options;
    options  = filter;
    filter   = null;
  }

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

    // Should always be an array
    recordOptions.excludeScope = [].concat(recordOptions.excludeScope);

    record(name, recordOptions);
  });
}

describeFixture.only = function(name, options, callback) {
  if (arguments.length === 2 && typeof arguments[1] === 'function') {
    callback = options;
  }

  return describeFixture(name, 'only', options, callback)
}

describeFixture.skip = function(name, options, callback) {
  if (arguments.length === 2 && typeof arguments[1] === 'function') {
    callback = options;
  }

  return describeFixture(name, 'skip', options, callback)
}

describeFixture.setDefaultConfig = function(newConfig) {
  if (!newConfig) {
    defaultConfig = {
      excludeScope:     ['localhost', '127.0.0.1', '0.0.0.0'],
      overwrite:        false,
      recordOnFailure:  false,
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
