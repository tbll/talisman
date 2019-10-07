const tools = require('./tools');
const db = require('./db');

module.exports = {
  handle: function (request, response) {
    var body = ''
    request.on('data', (data) => { body += data });
    request.on('end', () => {
      console.log("BUTTON BODY");
      console.log(request.headers);
      const button = parseInt(body);
      var user = request.headers["user"];
      if (!user) {
        user = request.headers["User"];
      }
      tools.sanitizeUser(user, (user, registered) => {
        if (!registered) {
          tools.reportError(response, 412, body.user + " doesn't exist");
        } else {
          db.addClick(user, button).then(() => {
            response.writeHead(200, {'Content-Type': 'text/html'})
            response.end('success')
          }, error => tools.reportError(response, 412, error));
        }
      }, error => tools.reportError(response, 412, error));
    })
  }
};
