// Originally adapted from
// http://orchestrate.io/blog/2014/06/13/how-to-test-code-that-uses-http-apis-using-node-js-mocha-and-nock/

var nock   = require('nock');
var path   = require('path');
var fs     = require('fs');
var mkdirp = require('mkdirp');

module.exports = function (name, options) {
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
      startRecording(options);
    }
  });

  // Saves our recording if fixtures didn't already exist
  afterEach(function(done) {
    var recordOnFailure = !!process.env.NOCK_RECORD_ON_FAILURE;
    if (!hasFixtures && (this.currentTest.state !== 'failed' || recordOnFailure)) {
      hasFixtures  = true;
      var fixtures = nock.recorder.play();
      if (fixtures.length) {
        var fixtures = (options.output_objects) ? JSON.stringify(fixtures, null, 4) : fixtures.join('\n');

        var text     = 'var nock = require(\'nock\');\n'
          + 'module.exports = function() {\n'
          + fixtures
          + '};';

        return mkdirp(path.dirname(fixturePath), function(err) {
          if(err) { return done(err); }

          return fs.writeFile(fixturePath, text, done);
        });
      } else {
        return done();
      }
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

function startRecording(options) {
  nock.restore();
  nock.recorder.clear();
  nock.recorder.rec(options);
}
