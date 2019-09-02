const querystring = require('querystring');
const tools = require('./tools');
const db = require('./db');

module.exports = {
  handle: function (request, response) {
    var body = '';
    request.on('data', (data) => { body += data });
    request.on('end', () => {
      tools.sanitizeUser(querystring.parse(body).user).then(({user, registered}) => {
        if (registered) {
          console.warn("User already exist");
          response.writeHead(303, {Location: '/s/button-instructions.html'});
          response.end();
        } else {
          db.register(user).then(() => {
            console.log("User " + user + " created");
            response.writeHead(303, {Location: '/s/button-instructions.html'});
            response.end();
          }, error => tools.reportError(response, 500, error));
        }
      }, error => tools.reportError(response, 412, error));
    })
  }
}
