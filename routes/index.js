var express = require('express');
var router = express.Router();
var { BrowserRequest } = rRequire('./services/BrowserRequest.js');
var { tunnel } = rRequire('./services/tunnel.js');

var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.post('/tunnel/handle-request', upload.single('data'),
  function(req, res, next) {
    var id = req.headers['x-request-id'];
    if (id) {
      let response = req.body;

      response.body = req.file ? req.file.buffer : req.body.data;

      if (!response.body) {
        response.body = req.body.error ? req.body.error :
          `Proxy responded to request ${id}, but file named "data" absent in POST data from proxy`;
        console.error('Tunnel responded with error:', response.body);
        response.status = 500;
      }

      tunnel.respondToBrowserRequest(id, response);
    }

    tunnel.redirectNextRequest(res);
  });

router.get('/*', function(req, res, next) {
  new BrowserRequest(req, res);
});

// testing of 'multer':
router.post('/binary', upload.single('body'),
  function(req, res, next) {
    var fs = require('fs');
    fs.writeFile("./output.jpg", req.file.buffer,
      (err) => {
        console.log('RESULT', err);
        res.end();
      });
  });

module.exports = router;
