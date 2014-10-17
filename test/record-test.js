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

  after(function() {
    var fixturePath = 'fixtures/Recording/saves a fixture with the server response.js';
    assert(fs.existsSync(path.join(__dirname, fixturePath)));
  });

  it('saves a fixture with the server response', function(done) {
    request('http://localhost:4000/test', done);
  });
});
