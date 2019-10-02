var DEBUG = {
  sunday: false
};

window.onload = () => {
  const hash = document.location.hash;
  if (hash.includes("#clear")) {
    localStorage.clear();
  }
  if (hash.includes("#sunday")) {
    DEBUG.sunday = true;
  }

  const sections = $$("section");
  const buttons = $$("section .button");
  for (let b of buttons) {
    b.onclick = (dest => () => navigate(dest))(b.dataset.goto);
  }
  navigate("landing");
};

function wait(message) {
  if ($("#loading").classList.contains("loading")) {
    alert("ERROR: 01");
  }
  $("#loading").innerText = message;
  $("#loading").classList.add("loading");
}

function unwait() {
  if (!$("#loading").classList.contains("loading")) {
    alert("ERROR: 02");
  }
  $("#loading").classList.remove("loading");
}

function navigate(dest) {
  const active = $("section.active");
  const from  = active ? active.id : undefined;
  if (active) {
    active.classList.remove("active");
  }
  $(`section#${dest}`).classList.add("active");

  if (dest == "landing") {
    if (localStorage.getItem("username")) {
      navigate("landing-identified");
    } else {
      navigate("landing-anon");
    }
  }

  if (from == "login" && dest == "post-signin") {
    wait("connecting…");
    api.login($("#login input").value, (login) => {
      unwait();
      localStorage.setItem("username", login);
      $("#post-signin .username").textContent = login;
    }, (error) => {
      unwait();
      alert("ERROR: 03. " + error);
      navigate("landing");
    });
  }

  if (from == "signup" && dest == "post-signin") {
    wait("signin up…");
    api.signup($("#signup input").value, (login) => {
      unwait();
      localStorage.setItem("username", login);
      $("#post-signin .username").textContent = login;
    }, (error) => {
      unwait();
      alert("ERROR: 04. " + error);
      navigate("landing");
    });
  }

  if (from == "moodreview") {
    const mood = $("#moodreview input").value;
    api.uploadMood(mood, () => {}, error => {
      console.log(error);
      alert("ERROR: 0.5. " + error);
    });
  }

  if (dest == "daycloud") {
    wait("Retrieving daycloud");
    api.downloadDayClicks(clicks => {
      buildDayCloud(clicks);
      unwait();
    }, error => {
      unwait();
      alert("ERROR: 0.6. " + error);
      navigate("landing");
    });
  }

  if (dest == "maybeweekreview") {
    var today = new Date();
    if (today.getDay() == 0 || DEBUG.sunday) {
      navigate("sunday");
    } else {
      navigate("reviewdone");
    }
  }
}

// ----- utils

const $ = (str, parent) => {
  parent = parent ? parent : document;
  return parent.querySelector(str);
}
const $$ = (str, parent) => {
  parent = parent ? parent : document;
  const nodes = parent.querySelectorAll(str);
  return Array.from(nodes);
};

