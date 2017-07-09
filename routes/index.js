var express = require('express');
var router = express.Router();
var { Request } = rRequire('./services/Request.js');
var { tunnel } = rRequire('./services/tunnel.js');

var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.post('/tunnel/handle-request', upload.single('data'),
  function(req, res, next) {
    var id = req.headers['x-request-id'];
    if (id) {
      let response = {headers: req.body.headers};

      response.body = req.file ? req.file.buffer : req.body.data;
      if (!response.body) {
       response.body = req.body.error ? req.body.error :
         `Proxy responded to request ${id}, but file named "data" absent in POST data from proxy`;
        console.error(response.body);
        response.code = 500;
      }

      tunnel.respondToRequest(id, response);
    }

    tunnel.redirectNextRequest(res);
  });

router.get('/*', function(req, res, next) {
  new Request(req, res);
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
