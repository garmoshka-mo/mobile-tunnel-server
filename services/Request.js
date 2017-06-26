const uuidv1 = require('uuid/v1');
var { tunnel } = require('./tunnel.js');

exports.Request = class {

  constructor(req, res) {
    this.id = uuidv1();
    this.data = {
      id: this.id,
      method: req.method,
      url: req.url,
      headers: req.headers
    };
    this.res = res;

    tunnel.addRequest(this);
  }

  respond(data) {
    this.res.send(data);
  }

};