const fs = require('fs');
const path = require('path');
const tools = require('./tools');

module.exports = {
  handle: function (request, response, pathname, header, footer) {
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
        tools.reportError(response, 404, `File ${pathname} not found!`);
        return;
      }
      if (fs.statSync(pathname).isDirectory()) {
        pathname += '/index.html';
        ext = ".html";
      }
      fs.readFile(pathname, function(err, data){
        if(err){
          tools.reportError(response, 500, `Error getting the file: ${err}.`);
          return;
        } else {
          if (header) data = header + data;
          if (footer) data = data + footer;
          response.setHeader('Content-type', map[ext] || 'text/plain' );
          response.end(data);
        }
      });
    });
  }};
