var proxyquire = require('proxyquire').noPreserveCache();
var assert = require('assert');
var describeFixture = require('./../lib/describe-fixture');

var testName = 'testTitle';

var testOptions = {
  output_objects: true,
  dont_print: true,
  enable_reqheaders_recording: true
}

describe('describeFixture', function() {

  var recordStub = function(name, options) {
    assert.equal(name, testName, 'title is ok');
    assert.deepEqual(options, testOptions, 'options are equal');
  }

  var describeFixture = proxyquire('./../lib/describe-fixture', { './recorder': recordStub });

  it('is called with name and options', function() {
    describeFixture(testName, function() {}, testOptions);
  });

  describe('#only', function() {
    it('is called with name options', function() {
      describeFixture.only(testName, function() {}, testOptions);
    });
  });

  describe('#skip', function() {
    it('is called with name and options', function() {
      describeFixture.skip(testName, function() {}, testOptions);
    });
  });

  it('is called without options', function() {
    var recordStub = function(name, options) {
      assert.equal(name, testName, 'title is ok');
      assert.deepEqual(options, { dont_print: true }, 'options are equal');
    }
    var describeFixture = proxyquire('./../lib/describe-fixture', { './recorder': recordStub });
    describeFixture(testName, function() {});
  });
});
