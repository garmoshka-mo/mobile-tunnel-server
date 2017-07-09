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
    this.responseToBrowser = res;

    tunnel.addRequest(this);
  }

  respond(data) {
    if (data.status == 200) {
      this.responseToBrowser.set( JSON.parse(data.headers) );
      this.responseToBrowser.send( data.body );
    } else {
      this.responseToBrowser.status( parseInt(data.status) );
      this.responseToBrowser.send( data.body.toString() );
    }
  }

};