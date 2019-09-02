const fs = require('fs');

const DB = {
  _data: {},
  _loaded: false,
  _dirty: false,
  load: () => {
    console.log("loading DB");
    DB._loaded = true;
    setInterval(() => DB.flush(), 5000);
    const data = fs.readFileSync('data.json');
    DB._data = JSON.parse(data);
  },
  flush: () => {
    if (DB._dirty) {
      console.log("Writting DB");
      const data = JSON.stringify(DB._data, null, 2);
      fs.writeFileSync('data.json', data);
      DB._dirty = false;
    }
  },
  isUserRegistered: user => {
    return new Promise(ok => ok(user in DB._data));
  },
  register: user => {
    return new Promise((ok, ko) => {
      if (user in DB._data) {
        ko("user exists");
        return;
      }
      DB._data[user] = {
        button: [],
        mood: []
      };
      DB._dirty = true;
      ok();
    });
  },
  addClick: (user, number) => {
    return new Promise((ok, ko) => {
      if (!(user in DB._data)) {
        ko("user doesn't exist");
        return;
      }
      DB._data[user].button.push({
        time: (new Date().getTime()),
        button: number
      });
      DB._dirty = true;
      ok();
    });
  },
  addMood: (user, mood) => {
    return new Promise((ok, ko) => {
      if (!(user in DB._data)) {
        ko("user doesn't exist");
        return;
      }
      DB._data[user].mood.push({
        time: (new Date().getTime()),
        mood,
      });
      DB._dirty = true;
      ok();
    });
  },
  getWeek: user => {
    return new Promise((ok, ko) => {
      if (!(user in DB._data)) {
        ko("user doesn't exist");
        return;
      }
      const now = new Date().getTime();
      const ms_in_a_week = 7 * 24 * 3600 * 1000;
      const bweek = DB._data[user].button.filter(i => (now - i.time) < ms_in_a_week);
      const button_summary = {good: 0, bad: 0, verybad: 0};
      for (var i of bweek) {
        if (i.button == 0) {
          button_summary.good++;
        } else if (i.button == 1) {
          button_summary.bad++;
        } else if (i.button == 2) {
          button_summary.verybad++;
        };
      }
      ok(button_summary);
    });
  },
}

module.exports = DB;
