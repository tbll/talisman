const http = require('http')
const fs = require('fs');
const url = require('url');
const path = require('path');
const mkdirp = require('mkdirp');
const querystring = require('querystring');

const server = http.createServer(function(request, response) {
  const today = new Date();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date+' '+time;
  const ip = request.connection.remoteAddress;

  log("connection at " + dateTime + " from " + ip);

  if (request.url == "/register" && request.method == "GET") {
    serve('./static/register.html', response);
  } else if (request.url == "/register" && request.method == "POST") {
    var body = ''
    request.on('data', (data) => { body += data });
    request.on('end', () => {
      var user = querystring.parse(body).user;
      if (!user) {
        response.writeHead(412, {'Content-Type': 'text/html'})
        response.end('No user in request body')
        log('No user in request body')
        return;
      } else if (user.length > 128) {
        response.writeHead(412, {'Content-Type': 'text/html'})
        response.end('User name too long')
        log("username too long:" + user);
        return;
      }
      var user2 = user.replace(/[^0-9a-z@\.]/gi, '');
      if (user2 != user) {
        response.writeHead(412, {'Content-Type': 'text/html'})
        response.end('Username should not use special characters')
        log("Bad username: " + user);
        return;
      }
      var user = "./data/" + user;
      fs.exists(user, function (exist) {
        if(exist) {
          response.writeHead(412, {'Content-Type': 'text/html'})
          response.end('Internal error')
          log(user + " already exist");
        } else {
          mkdirp(user, function(err) { 
            if (err) {
              response.writeHead(412, {'Content-Type': 'text/html'})
              response.end('Internal error')
              log("Failed to create user dir: " + err);
            } else {
              fs.writeFile(user + "/button.txt", "");
              response.writeHead(200, {'Content-Type': 'text/html'})
              response.end('success')
              log("User " + user + " created");
            }
          });
        }
      });
    })
  } else if (request.url == "/button" && request.method == "PUT") {
    var body = ''
    request.on('data', (data) => { body += data });
    request.on('end', () => {
      const button = parseInt(body);
      var user = request.headers["user"];
      if (!user) {
        response.writeHead(412, {'Content-Type': 'text/html'})
        response.end('Missing user header')
      } else {
        user = user.replace(/[^0-9a-z@\.]/gi, '');
        const line = dateTime + "," + button + "," + user + "\n";
        fs.appendFile('data/' + user + '/button.txt', line, function (err) {
          if (err)  {
            log("err:" + err);
            response.writeHead(500, {'Content-Type': 'text/html'})
            response.end('can\'t write data. User registered?')
          } else {
            response.writeHead(200, {'Content-Type': 'text/html'})
            response.end('success')
          }
        });
      }
    })
  } else if (request.url.startsWith("/s/") && request.method == "GET") {
    const parsedUrl = url.parse(request.url);
    var pathname = `./static/${parsedUrl.pathname}`;
    serve(pathname, response);
  } else {
    response.writeHead(400, {'Content-Type': 'text/html'})
    response.end('Not found')
  }
})

const port = 23;
const host = '0.0.0.0';
server.listen(port, host);
log(`Listening at http://${host}:${port}`);

function serve(pathname, response) {
  var pathname = pathname.replace(/^(\.)+/, '.');
  var ext = path.parse(pathname).ext;
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
  };
  fs.exists(pathname, function (exist) {
    if(!exist) {
      response.statusCode = 404;
      response.end(`File ${pathname} not found!`);
      return;
    }
    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
      ext = ".html";
    }
    fs.readFile(pathname, function(err, data){
      if(err){
        response.statusCode = 500;
        response.end(`Error getting the file: ${err}.`);
      } else {
        response.setHeader('Content-type', map[ext] || 'text/plain' );
        response.end(data);
      }
    });
  });
}

function log(msg) {
  console.log(msg);
}
