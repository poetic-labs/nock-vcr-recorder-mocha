var fs              = require('fs');
var assert          = require('assert');
var request         = require('request');
var path            = require('path');
var app             = require('./app');
var describeFixture = require('../lib/describe-fixture');

describeFixture('Recording', function() {
  before(function(done) {
    app.listen(4000, done);
  });

  describe('successful', function() {
    after(function() {
      var fixturePath = 'fixtures/Recording/successful/saves a fixture with the server response.js';
      assert(fs.existsSync(path.join(__dirname, fixturePath)));

      var fixturePath = 'fixtures/Recording/successful/doesn\'t save a file when no requests are made.js';
      assert(!fs.existsSync(path.join(__dirname, fixturePath)));
    });

    it('saves a fixture with the server response', function(done) {
      request('http://localhost:4000/test', done);
    });

    it('doesn\'t save a file when no requests are made', function() {
      assert(true);
    });
  });

});

// The order in this group of tests is important for it to run correctly. The
// afterEach's need to run in a particular order
describe('Recording', function() {
  before(function(done) {
    app.listen(4002, done);
  });

  afterEach(function() {
    var fixturepath = 'fixtures/recording/failure/doesn\'t save a fixture when the test fails.js';
    assert(!fs.existsSync(path.join(__dirname, fixturepath)), 'fixture should not exist');
  });

  describeFixture('failure', function() {
    afterEach(function() {
      // This is some hackery to make it think the test failed when it really
      // didn't. This works because it uses state internally to check for
      // a failure.
      this.currentTest.state = 'failed';
    });

    it('doesn\'t save a fixture when the test fails', function(done) {
      request('http://localhost:4000/test', done);
    });
  });
});

// The order in this group of tests is important for it to run correctly. The
// afterEach's need to run in a particular order
// Skipped as this test passes localy but not on CI. :(
describe.skip('Recording', function() {
  before(function(done) {
    process.env.NOCK_RECORD_ON_FAILURE = true;
    app.listen(4003, done);
  });

  afterEach(function() {
    var fixturepath = 'fixtures/recording/NOCK_RECORD_ON_FAILURE/saves a fixture when the test fails.js';
    assert(fs.existsSync(path.join(__dirname, fixturepath)), 'fixture should exist');
    delete process.env.NOCK_RECORD_ON_FAILURE;
  });

  describeFixture('NOCK_RECORD_ON_FAILURE', function() {
    afterEach(function() {
      // This is some hackery to make it think the test failed when it really
      // didn't. This works because it uses state internally to check for
      // a failure.
      this.currentTest.state = 'failed';
    });

    it('saves a fixture when the test fails', function(done) {
      request('http://localhost:4000/test', done);
    });
  });
});
