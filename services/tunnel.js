class Tunnel {

  constructor() {
    this.queuedRequests = [];
    this.requestsMap = {};
  }

  addRequest(req) {
    this.queuedRequests.push(req);
    this.requestsMap[req.id] = req;
    this.redirectRequestIfAny();
  }

  respondToRequest(id, response) {
    let request = this.requestsMap[id];
    if (request) {
      delete this.requestsMap[id];
      request.respond(response);
    }
  }

  redirectNextRequest(res) {
    this.pendingResponseToProxy = res;
    this.redirectRequestIfAny();
  }

  redirectRequestIfAny() {
    if (this.queuedRequests.length) {
      let req = this.queuedRequests.shift();
      this.pendingResponseToProxy.json(req.data);
      this.pendingResponseToProxy = null;
    }
  }

}

exports.tunnel = new Tunnel;