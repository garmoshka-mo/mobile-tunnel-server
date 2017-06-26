var express = require('express');
var router = express.Router();
var { Request } = rRequire('./services/Request.js');
var { tunnel } = rRequire('./services/tunnel.js');

router.post('/tunnel/handle-request', function(req, res, next) {
  var id = req.headers['x-request-id'];
  if (id) tunnel.respondToRequest(id, req.body);

  tunnel.redirectNextRequest(res);
});

router.get('/*', function(req, res, next) {
  new Request(req, res);
});

module.exports = router;
