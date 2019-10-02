const tools = require('./tools');
const db = require('./db');

module.exports = {
  handle: function (request, response) {
    response.writeHead(200, {'Content-Type': 'application/json'})
    var body = '';
    request.on('data', (data) => { body += data });
    request.on('end', () => {

      var json;

      try {
        json = JSON.parse(body)
      } catch(e) {
        console.log("JSON malformated");
        return response.end(JSON.stringify({ error: "JSON malformated"}));
      }

      if (json.method == "signin" || json.method == "signup") {
        tools.sanitizeUser(json.params.username, (username, registered) => {
          if (!registered) {
            if (json.method == "signin") {
              response.end(JSON.stringify({ error: "Unknown user" }));
            } else {
              db.register(username).then(() => {
                console.log("User " + username + " created");
                response.end(JSON.stringify({ username }));
              }, error => response.end(JSON.stringify({ error: "DB error:" + error })));
            }
          } else {
            response.end(JSON.stringify({ username }));
          }
        }, (error) => {
            response.end(JSON.stringify({ error }));
        });
        return;
      }

      if (json.method == "mood") {
        db.addMood(json.params.username, json.params.mood).then(() => {
          console.log("mood registered");
          response.end(JSON.stringify({ }));
        }, error => {
          response.end(JSON.stringify({ error }));
        });
        return;
      }

      if (json.method == "weekclicks") {
        db.getWeek(json.params.username).then(clicks => {
          console.log("clicks retrieved");
          response.end(JSON.stringify(clicks));
        }, error => {
          response.end(JSON.stringify({ error }));
        });
        return;
      }

      response.end(JSON.stringify({ error: "unkonwn api method" }));

    });
  }
}
