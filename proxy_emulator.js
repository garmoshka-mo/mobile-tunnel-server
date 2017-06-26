var request = require('request');

makeRequest();



function makeRequest(id, data) {

  let options = {
    timeout: 30 * 1000,
    json:true };

  if (id) {
    options.headers = {'X-Request-ID': id};
    options.json = { key: data };
  }

  console.log(`Sending request ${id}...`);

  request.post(
    'http://localhost:3000/tunnel/handle-request',
    options,
    function (error, response, body) {
      if (error) {
        if (['ECONNRESET', 'ECONNREFUSED', 'ESOCKETTIMEDOUT'].includes(error.code)) {
          console.log('timeout reached');
          makeRequest();
        } else
          console.error(error);
      } else if (response.statusCode == 200) {
        let text = `This is response to ${body.id} with method ${body.method} ${body.url}`;
        console.log(text);
        makeRequest(body.id, text);
      } else {
        console.error(response.statusCode, body);
      }
    }
  );

}