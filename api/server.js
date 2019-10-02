const Services = {
  "static": require('./static'),
  "button": require('./button'),
  "api": require('./api'),
  "review": require('./review'),
};

const http = require('http')
const url = require('url');
const tools = require('./tools');
const db = require('./db');

const server = http.createServer((request, response) => {
  const ip = request.connection.remoteAddress;
  console.log("connection at " + tools.getTime() + " from " + ip);

  var rurl = request.url.replace(/\/$/, "");

  if (rurl == "/api" && request.method == "POST") {
    Services.api.handle(request, response);
  } else if (rurl == "/review" && request.method == "GET") {
    Services.static.handle(request, response, './s/review.html');
  } else if (rurl == "/review" && request.method == "POST") {
    Services.review.handle(request, response);
  } else if (rurl == "/data" && request.method == "GET") {
    Services.static.handle(request, response, './data.json');
  } else if (rurl == "/button" && request.method == "PUT") {
    Services.button.handle(request, response);
  } else if (rurl.startsWith("/s/") && request.method == "GET") {
    const parsedUrl = url.parse(rurl);
    var pathname = `./${parsedUrl.pathname}`;
    Services.static.handle(require, response, pathname);
  } else {
    response.writeHead(400, {'Content-Type': 'text/html'})
    response.end('Not found')
  }
})

db.load();
const port = 1080;
const host = '0.0.0.0';
server.listen(port, host);
console.log(`Listening at http://${host}:${port}`);
