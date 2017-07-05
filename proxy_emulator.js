var request = require('request');

const CONFIG = {
  serverOrigin: 'http://zaloop.tk:3000',
  localServiceOrigin: 'http://localhost:8888',
  //serverOrigin: 'http://localhost:3000',
  //localServiceOrigin: 'http://192.168.1.254:8080',
  deviceId: 'test-emulator-id',
  serverRequestTimeout: 30,
  localRequestTimeout: 60
};

makeRequest();

function makeRequest(id, form) {

  let options = {
    timeout: CONFIG.serverRequestTimeout * 1000
  };

  if (id) {
    options.headers = {
      'X-Request-ID': id,
      'Device-ID': CONFIG.deviceId
    };
    options.form = form;
  }

  if (!id)
    console.log(`Sending initial request...`);
  else
    console.log(`Sending response to ${id}...`);

  request.post(
    `${CONFIG.serverOrigin}/tunnel/handle-request`,
    options, processResult
  );

  function processResult(error, response, body) {
    if (error) {

      // console.log() logic not required in JAVA:
      if (['ECONNRESET', 'ECONNREFUSED', 'ESOCKETTIMEDOUT'].includes(error.code))
        console.log(error.code);
      else
        console.error(error);

      // If any error occurred, retry after 3 seconds:
      setTimeout(makeRequest, 3000);

    } else if (response.statusCode != 200) {

      console.error(response.statusCode, body);
      setTimeout(makeRequest, 3000);

    } else {

      body = JSON.parse(body);
      makeLocalRequest(body.method, body.url, (result) => {
        makeRequest(body.id, result);
      });

    }
  }

  function makeLocalRequest(method, url, callback) {
    let localUrl = `${CONFIG.localServiceOrigin}${url}`;

    console.log(`Local request ${method} ${localUrl}...`);
    request({
      method: method,
      uri: localUrl,
      timeout: CONFIG.localRequestTimeout * 1000
    }, processResult);

    function processResult(error, response, body) {
      let result;
      if (error) {
        result = {body: error.code};
      } else {

        result = {
          headers: getHeaders(response),
          body: error ? error.code : body
        };
      }
      callback(result);
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

}