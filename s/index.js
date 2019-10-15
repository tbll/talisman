var DEBUG = {
  sunday: false
};

var test_timout = undefined;

window.onload = () => {
  const hash = document.location.hash;
  if (hash.includes("#sunday")) {
    DEBUG.sunday = true;
  }

  buildCalendar();

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

  if (dest == "logout") {
    localStorage.clear();
    navigate("landing");
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

  if (dest == "testbutton") {
    const logs = $("#testbuttonlogs");
    logs.textContent = "";
    var count = 0;
    var a = t => {
      logs.textContent = count++ + ": " + t + "\n" + logs.textContent;
    };
    var test = () => {
      a("waiting…");
      api.testButton(json => {
        if (json.error) {
          a("error: " + json.error);
        } else {
          for (var c of json.clicks) {
            a("click #" + c.button);
          }
        }
        test_timout = setTimeout(test, 1000);
      }, error => {
        a("error: " + error);
        test_timout = setTimeout(test, 1000);
      });
    };
    test();
  }

  if (from == "testbutton") {
    if (test_timout) {
      clearTimeout(test_timout);
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

Date.prototype.monthDays = function() {
  var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
  return d.getDate();
}

function buildCalendar() {
  var days = [];
  var now = new Date();
  var first = new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6;
  first = first % 7;
  var days_this_month = now.monthDays(); // 1..31
  var cal = $("#calendar");
  var today = now.getDate();
  for (var i = 0; i < (6 * 7); i++) {
    var text = "";
    if (i >= first) {
      if (i < first + days_this_month) {
        text = i - first + 1;
      }
    }
    var div = document.createElement("div");
    if (text == today) {
      div.className = "today";
    } else if (text > today) {
      div.className = "future";
    } else {
      div.className = "past";
    }
    div.textContent = text;
    cal.appendChild(div);
  }

}
