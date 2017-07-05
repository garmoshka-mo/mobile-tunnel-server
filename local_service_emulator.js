var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname;

  response.writeHead(200);

  let text = `This is response to ${request.method} ${uri}`;
  response.write(text);
  response.end();

}).listen(parseInt(port, 10));

console.log(
`Static file server running at
  => http://localhost:${port}
CTRL + C to shutdown`
);