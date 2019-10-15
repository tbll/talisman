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
  testButton: (ok, ko) => {
    const username = localStorage.getItem("username");
    run("test-button", {username}, ok, ko)
  },
  uploadMood: (mood, ok, ko) => {
    const username = localStorage.getItem("username");
    run("mood", {username, mood}, ok, ko);
  },
  downloadDayClicks: (ok, ko) => {
    const username = localStorage.getItem("username");
    run("dayclicks", {username}, ok, ko);
  },
  fake: () => {
    const username = localStorage.getItem("username");
    run("fake", {username}, () => {
      console.log("fake data created");
    }, error => {
      console.log("failed fake data: " + error);
    });
  }
};
