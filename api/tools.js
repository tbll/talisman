const db = require('./db');

module.exports = {
  sanitizeUser: function (user, ok, ko) {
    if (!user) {
      return ko("Invalid user");
    }
    user = user.toLowerCase();
    user = user.trim();
    if (user.length > 128) {
      return ko("Username too long");
    }
    var user2 = user.replace(/[^0-9a-z@\.]/gi, '');
    if (user2 != user) {
      return ko("Username should not use special characters");
    }
    db.isUserRegistered(user).then(registered => ok(user, registered));
  },
  getTime: () => {
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date +' '+time;
    return dateTime;
  },
  reportError: function (response, code, message) {
    console.log(message);
    response.writeHead(code, {'Content-Type': 'text/html'});
    response.end(message);
  }
}
