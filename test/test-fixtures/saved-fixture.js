var nock = require('nock');
module.exports = function() {

nock('http://localhost:4001')
  .get('/shouldnt-be-called')
  .reply(200, "ok", { 'x-powered-by': 'Express',
  'content-type': 'text/html; charset=utf-8',
  'content-length': '2',
  etag: '"2044517703"',
  date: 'Fri, 17 Oct 2014 22:40:53 GMT',
  connection: 'keep-alive' });
};

