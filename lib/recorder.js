// Originally adapted from
// http://orchestrate.io/blog/2014/06/13/how-to-test-code-that-uses-http-apis-using-node-js-mocha-and-nock/

var nock   = require('nock');
var path   = require('path');
var fs     = require('fs');
var mkdirp = require('mkdirp');

module.exports = function (name, options) {
  var hasFixtures = !!options.overwrite;

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
        startRecording(options);
      }
    } else {
      hasFixtures = false;
      startRecording(options);
    }
  });

  // Saves our recording if fixtures didn't already exist
  afterEach(function(done) {
    var recordOnFailure = !!options.recordOnFailure;
    if (!hasFixtures && (this.currentTest.state !== 'failed' || recordOnFailure)) {
      hasFixtures  = true;
      var fixtures = nock.recorder.play();
      if (fixtures.length) {
        var header = 'var nock = require(\'nock\');\n'
                    + 'module.exports = function() {\n';

        var body;
        if (options.recorder.output_objects) {
          fixtures = removeExcludedScopeFromArray(fixtures, options.excludeScope);
          body     = 'nock.define(' + JSON.stringify(fixtures, null, 2) + ');';
        } else {
          body = removeExcludedScopeFromString(fixtures, options.excludeScope);
        };

        var footer = '\n};';

        return mkdirp(path.dirname(fixturePath), function(err) {
          if(err) { return done(err); }

          return fs.writeFile(fixturePath, header + body + footer, done);
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
  nock.recorder.rec(options.recorder);
}

function removeExcludedScopeFromString(lines, scope) {
  if (!scope.length) {
    return lines;
  }

  var scopeRegex = new RegExp('nock\(.*(' + scope.join('|') + ').*\)');

  return lines.reduce(function(result, line) {
    if (result.waitingForEnd) {
      if (/}\);$/.test(line)) {
        result.waitingForEnd = false
      }
    } else if(scopeRegex.test(line)) {
      result.waitingForEnd = true;
    } else {
      result.lines.push(line);
    }

    return result;
  }, { lines: [] }).lines.filter(Boolean).join('\n');
}

function removeExcludedScopeFromArray(fixtureArray, scope) {
  if (!scope.length) {
    return fixtureArray;
  }

  return fixtureArray.reduce(function(result, fixture) {
    var shouldExclude = scope.some(function(url) {
      return fixture.scope.indexOf(url) > -1;
    });

    if (!shouldExclude) {
      result.push(fixture);
    }

    return result;
  }, []);
}
