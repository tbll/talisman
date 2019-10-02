const fs = require('fs');

const DB = {
  _data: {},
  _loaded: false,
  _dirty: false,
  fakeData: user => {
    var buttons = [];
    var count = 30;
    while (count > 0) {
      count--;
      const button = Math.floor((Math.random() * 3) + 1);
      const ms_in_a_day = 24 * 3600 * 1000;
      const now = new Date().getTime();
      const time = now - Math.floor((Math.random() * ms_in_a_day));
      buttons.push({ button, time });
    }
    if (!(user in DB._data)) {
      DB._data[user] = {
        button: [],
        mood: []
      };
    }
    DB._data[user].button = buttons;
    DB._dirty = true;
  },
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
  getDayClicks: user => {
    return new Promise((ok, ko) => {
      if (!(user in DB._data)) {
        ko("user doesn't exist");
        return;
      }
      const now = new Date().getTime();
      const ms_in_a_day = 24 * 3600 * 1000;
      const bday = DB._data[user].button.filter(i => (now - i.time) < ms_in_a_day);
      ok(bday);
    });
  },
}

module.exports = DB;
