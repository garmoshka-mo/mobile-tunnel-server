let fetch = require('node-fetch');
var FormData = require('form-data');

const CONFIG = {
  //serverOrigin: 'http://zaloop.tk:3000',
  localServiceOrigin: 'http://localhost:8888',
  serverOrigin: 'http://localhost:3000',
  //localServiceOrigin: 'http://192.168.1.254:8080',
  deviceId: 'test-emulator-id',
  serverRequestTimeout: 30,
  localRequestTimeout: 60
};

makeRemoteRequest();

function makeRemoteRequest(id, form) {

  let options = {
    method: 'POST',
    timeout: CONFIG.serverRequestTimeout * 1000
  };

  if (id) {
    options.headers = {
      'X-Request-ID': id,
      'Device-ID': CONFIG.deviceId
    };
    options.body = form;
  }

  if (!id)
    console.log(`Sending initial request...`);
  else
    console.log(`Sending response to ${id}...`);

  fetch(`${CONFIG.serverOrigin}/tunnel/handle-request`, options)
    .then(processResponse)
    .then(processJsonBody)
    .catch(processConnectionError);

  function processConnectionError(error) {
    console.error(error.code || error.type || error);
    // If any error occurred, retry after 3 seconds:
    setTimeout(makeRemoteRequest, 3000);
  }

  function processResponse(response) {
    if (response.status != 200) {
      console.error(response.status, response.statusText);
      setTimeout(makeRemoteRequest, 3000);
    } else
      // parse body as json:
      return response.json();
  }

  function processJsonBody(body) {
    makeLocalRequest(body.method, body.url, (form) => {
      makeRemoteRequest(body.id, form);
    });
  }

}

function makeLocalRequest(method, url, callback) {

  let localUrl = `${CONFIG.localServiceOrigin}${url}`;
  let options = {
    method: method,
    timeout: CONFIG.localRequestTimeout * 1000
  };

  console.log(`Local request ${method} ${localUrl}...`);
  fetch(localUrl, options)
    .then(processResponse)
    .then(processBuffer)
    .catch(processConnectionError);

  function processConnectionError(error) {
    var form = new FormData();
    form.append('error', JSON.stringify(error.code || error.type || error));
    callback(form);
  }

  function processResponse(response) {
    return response.buffer();
  }

  function processBuffer(buffer) {
    var form = new FormData();
    form.append('data', buffer, {
      filename: 'unicycle.jpg',
      contentType: 'image/jpeg'
    });
    callback(form);
  }

  function getHeaders(response) {
    // overcomplicated conversion, because in nodejs response.headers has amended letters case
    var headers = {};
    for (var i = 0; i < response.rawHeaders.length; i+=2) {
      headers[response.rawHeaders[i]] = response.rawHeaders[i+1];
    }
    return headers;
  }

}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});