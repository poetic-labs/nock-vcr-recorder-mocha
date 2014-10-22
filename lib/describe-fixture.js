
var record = require('./recorder');

function describeFixture(name, callback, filter) {
  var describeFn = describe;
  if (filter) {
    describeFn = describeFn[filter];
  }

  return describeFn(name, function() {
    callback.call(this);

    record(name);
  });
}

describeFixture.only = function(name, callback) {
  return describeFixture(name, callback, 'only')
}

describeFixture.skip = function(name, callback) {
  return describeFixture(name, callback, 'skip')
}

module.exports = describeFixture;
