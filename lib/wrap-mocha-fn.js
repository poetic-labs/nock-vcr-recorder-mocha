'use strict';

var assert = require('assert');

module.exports = function(method, mainCb) {
  function wrapper(name, filter, options, callback) {
    if (arguments.length === 2 && typeof filter === 'function') {
      callback = filter;
      filter   = null;
      options  = {};
    } else if (arguments.length === 3 && typeof filter === 'object'
              && typeof options === 'function') {
      callback = options;
      options  = filter;
      filter   = null;
    }

    assert(name, 'name should be defined');
    assert(callback, 'callback should be defined');

    if (filter) {
      method = method[filter]
    }

    return method(name, function() {
      return mainCb.call(this, name, options, callback);
    });
  }


  wrapper.only = function(name, options, callback) {
    if (arguments.length === 2 && typeof arguments[1] === 'function') {
      callback = options;
      options  = null;
    }

    return wrapper(name, 'only', options, callback)
  }

  wrapper.skip = function(name, options, callback) {
    if (arguments.length === 2 && typeof arguments[1] === 'function') {
      callback = options;
      options  = null;
    }

    return wrapper(name, 'skip', options, callback)
  }

  return wrapper;
}
