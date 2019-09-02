const tools = require('./tools');
const db = require('./db');

module.exports = {
  handle: function (request, response) {
    var body = '';
    request.on('data', (data) => { body += data });
    request.on('end', () => {
      var json;
      try {
        json = JSON.parse(body)
      } catch(e) {
        return tools.reportError(response, 500, "Request not formated properly");
      }
      tools.sanitizeUser(json.user).then(({user, registered}) => {
        if (!registered) {
          return tools.reportError(response, 412, json.user + " doesn't exist");
        }
        db.addMood(user, json.mood).then(() => {
          db.getWeek(user).then(week => {
            response.writeHead(200, {'Content-Type': 'application/json'})
            response.end(JSON.stringify(week));
            // FIXME: propagate errors
          }, error => tools.reportError(response, 412, error));
        }, error => tools.reportError(response, 412, error));
      }, error => tools.reportError(response, 412, error));
    })
  }
}

