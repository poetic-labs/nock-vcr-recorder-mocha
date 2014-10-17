// Originally adapted from
// http://orchestrate.io/blog/2014/06/13/how-to-test-code-that-uses-http-apis-using-node-js-mocha-and-nock/

var nock   = require('nock');
var path   = require('path');
var fs     = require('fs');
var mkdirp = require('mkdirp');

module.exports = function (name) {
  var hasFixtures = !!process.env.NOCK_RECORD;

  var fixturePath;
  beforeEach(function() {
    fixturePath = path.resolve(path.join('test', 'fixtures', getFixturePath(this)));

    if (!hasFixtures) {
      try {
        // Make sure we don't have any conflicting interceptors for this test
        nock.cleanAll();

        require(fixturePath)();
        hasFixtures = true;
      } catch (e) {
        startRecording();
      }
    } else {
      hasFixtures = false;
      startRecording();
    }
  });

  // Saves our recording if fixtures didn't already exist
  afterEach(function(done) {
    if (!hasFixtures) {
      hasFixtures  = true;
      var fixtures = nock.recorder.play();
      var text     = 'var nock = require(\'nock\');\n'
                      + 'module.exports = function() {\n'
                      + fixtures.join('\n')
                      + '};';

      return mkdirp(path.dirname(fixturePath), function(err) {
        if(err) { return done(err); }

        return fs.writeFile(fixturePath, text, done);
      });
    } else {
      return done();
    }
  });
};

function getFixturePath(ctx) {
  var parent      = ctx.currentTest.parent;
  var fixturePath = [];
  while(parent.title) {
    fixturePath.unshift(parent.title);
    parent = parent.parent;
  }
  fixturePath.push(ctx.currentTest.title + '.js');

  return path.join.apply(path, fixturePath);
}

function startRecording() {
  nock.restore();
  nock.recorder.rec({
    dont_print: true
  });
}
