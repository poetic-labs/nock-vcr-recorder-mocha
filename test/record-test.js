var fs              = require('fs');
var assert          = require('assert');
var request         = require('request');
var path            = require('path');
var app             = require('./app');
var describeFixture = require('../lib/describe-fixture');

describeFixture.setDefaultConfig({ excludeScope: 'github.com' });

describe('Recording', function() {
  before(function(done) {
    app.listen(4000, done);
  });

  describeFixture('successful', { recorder: { output_objects: false }}, function() {
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

  describeFixture('excludeScope array', {
    excludeScope: ['poeticsystems.com', 'github.com'],
    recorder: { output_objects: false }
  }, function() {
    after(function() {
      var fixturePath = 'fixtures/Recording/excludeScope array/excludes array of urls.js';
      var fixture = fs.readFileSync(path.join(__dirname, fixturePath), { encoding: 'utf8' });

      assert(!/github\.com/.test(fixture), 'fixture should not have recorded github');
    });

    it('excludes array of urls', function(done) {
      request('https://github.com/poetic.json', done);
    });
  });

  describeFixture('excludeScope string', {
    excludeScope: 'github.com'
  }, function() {
    after(function() {
      var fixturePath = 'fixtures/Recording/excludeScope string/excludes string url.js';
      var fixture = fs.readFileSync(path.join(__dirname, fixturePath), { encoding: 'utf8' });

      assert(!/github\.com/.test(fixture), 'fixture should not have recorded github');
    });

    it('excludes string url', function(done) {
      request('https://github.com/poetic.json', done);
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

  describeFixture('failure', { recorder: { output_objects: false }}, function() {
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
describe('Recording', function() {
  before(function(done) {
    app.listen(4003, done);
  });

  afterEach(function() {
    var fixturepath = 'fixtures/recording/NOCK_RECORD_ON_FAILURE/saves a fixture when the test fails.js';
    assert(fs.existsSync(path.join(__dirname, fixturepath)), 'fixture should exist');
  });

  describeFixture.skip('NOCK_RECORD_ON_FAILURE', {recordOnFailure: true}, function() {
    afterEach(function() {
      // This is some hackery to make it think the test failed when it really
      // didn't. This works because it uses state internally to check for
      // a failure.
      this.currentTest.state = 'failed';
    });

    it.skip('(fails CI) saves a fixture when the test fails', function(done) {
      request('http://localhost:4000/test', done);
    });
  });
});


describe('Recording - Output Objects', function() {
  before(function(done) {
    app.listen(4006, done);
  });

  describeFixture('successful', function() {
    after(function() {
      var fixturePath = 'fixtures/Recording - Output Objects/successful/saves a fixture with the server response.js';
      assert(fs.existsSync(path.join(__dirname, fixturePath)));

      var fixturePath = 'fixtures/Recording - Output Objects/successful/doesn\'t save a file when no requests are made.js';
      assert(!fs.existsSync(path.join(__dirname, fixturePath)));
    });

    it('saves a fixture with the server response', function(done) {
      request('http://localhost:4006/test', done);
    });

    it('doesn\'t save a file when no requests are made', function() {
      assert(true);
    });
  });

  describeFixture('excludeScope array', {
    excludeScope: ['github.com', 'poeticsystems.com']
  }, function() {
    after(function() {
      var fixturePath = 'fixtures/Recording - Output Objects/excludeScope array/excludes array of urls.js';
      var fixture = fs.readFileSync(path.join(__dirname, fixturePath), { encoding: 'utf8' });

      assert(!/github\.com/.test(fixture), 'fixture should not have recorded github');
    });

    it('excludes array of urls', function(done) {
      request('https://github.com/poetic.json', done);
    });
  });

  describeFixture('excludeScope string', {
    excludeScope: 'github.com'
  }, function() {
    after(function() {
      var fixturePath = 'fixtures/Recording - Output Objects/excludeScope string/excludes string url.js';
      var fixture = fs.readFileSync(path.join(__dirname, fixturePath), { encoding: 'utf8' });

      assert(!/github\.com/.test(fixture), 'fixture should not have recorded github');
    });

    it('excludes string url', function(done) {
      request('https://github.com/poetic.json', done);
    });
  });
});
