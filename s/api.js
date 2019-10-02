function run(method, params, ok, ko) {
  fetch("/api", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ method, params }),
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      response.text().then(msg => {
        ko("HTTP ERROR: " + msg);
      })
    }
  }).then(json => {
    if (json.error) {
      ko(json.error);
    } else {
      ok(json);
    }
  });
}

const api = {
  login: (username, ok, ko) => {
    run("signin", {username}, json => ok(json.username), ko)
  },
  signup: (username, ok, ko) => {
    run("signup", {username}, json => ok(json.username), ko)
  },
  uploadMood: (mood, ok, ko) => {
    const username = localStorage.getItem("username");
    run("mood", {username, mood}, ok, ko);
  },
  downloadWeekClicks: (ok, ko) => {
    const username = localStorage.getItem("username");
    run("weekclicks", {username}, ok, ko);
  },
};
