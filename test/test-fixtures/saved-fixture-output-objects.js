var nock = require('nock');
module.exports = function() {
nock.define([
  {
    "scope": "http://localhost:4007",
    "method": "GET",
    "path": "/shoudnt-be-called",
    "body": "",
    "status": 200,
    "response": "ok",
    "headers": {
      "x-powered-by": "Express",
      "content-type": "text/html; charset=utf-8",
      "content-length": "2",
      "etag": "\"2044517703\"",
      "date": "Wed, 03 Dec 2014 19:57:02 GMT",
      "connection": "keep-alive"
    }
  }
]);
};
