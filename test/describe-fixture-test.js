var proxyquire = require('proxyquire').noPreserveCache();
var assert = require('assert');
var describeFixture = require('./../lib/describe-fixture');

var testName = 'testTitle';

var testOptions = {
  excludeScope: ['localhost'],
  overwrite: false,
  recordOnFailure: false,
  recorder: {
    output_objects: false,
    dont_print: true,
    enable_reqheaders_recording: true
  }
};

describe('describeFixture', function() {
  var recordStub = function(name, options) {
    assert.equal(name, testName, 'title is ok');
    assert.deepEqual(options, testOptions);
  }

  var describeFixture = proxyquire('./../lib/describe-fixture', { './recorder': recordStub });

  it('is called with name and options', function() {
    describeFixture(testName, testOptions, noop);
  });

  describe('#only', function() {
    it('is called with name options', function() {
      describeFixture.only(testName, testOptions, noop);
    });
  });

  describe('#skip', function() {
    it('is called with name and options', function() {
      describeFixture.skip(testName, testOptions, noop);
    });
  });

  it('defaults to output objects', function() {
    var recordStub = function(name, options) {
      assert.equal(name, testName, 'title is ok');
      assert.deepEqual(options, {
        excludeScope: ['localhost'],
        overwrite: false,
        recordOnFailure: false,
        recorder: { output_objects: true, dont_print: true }
      });
    }
    var describeFixture = proxyquire('./../lib/describe-fixture', { './recorder': recordStub });
    describeFixture(testName, noop);
  });

  describe('#defaultConfig', function() {
    it('provide custom defaults', function() {
      var recordStub = function(name, options) {
        assert.equal(name, testName, 'title is ok');
        assert.deepEqual(options, {
          excludeScope: ['github.com'],
          overwrite: false,
          recordOnFailure: false,
          recorder: {
            output_objects: true,
            dont_print: false
          }
        });
      }
      var describeFixture = proxyquire('./../lib/describe-fixture', { './recorder': recordStub });

      describeFixture.setDefaultConfig({
        excludeScope: 'github.com',
        recorder: {
          dont_print: false
        }
      });

      describeFixture(testName, noop);
    });

    it('provide custom defaults and scoped options', function() {
      var recordStub = function(name, options) {
        assert.equal(name, testName, 'title is ok');
        assert.deepEqual(options, {
          excludeScope: ['poeticsystems.com'],
          overwrite: false,
          recordOnFailure: false,
          recorder: {
            output_objects: true,
            dont_print: true
          }
        });
      }
      var describeFixture = proxyquire('./../lib/describe-fixture', { './recorder': recordStub });

      describeFixture.setDefaultConfig({
        excludeScope: 'github.com',
        recorder: {
          dont_print: false
        }
      });

      describeFixture(testName, {
        excludeScope: 'poeticsystems.com',
        overwrite: false,
        recordOnFailure: false,
        recorder: { dont_print: true }
      }, noop);
    });
  });
});

function noop() {}
