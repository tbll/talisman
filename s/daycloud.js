function buildDayCloud(clicks) {
  const canvas = $("#daycloud canvas");
  const tw = canvas.width;
  const th = canvas.height;
  const ctx = canvas.getContext("2d");

  const ms_in_a_day = 24 * 3600 * 1000;
  const now = new Date().getTime();

  ctx.fillStyle = '#29dbe8';
  ctx.fillRect(0, 0, tw, th);

  for (var click of clicks) {
    var delta = now - click.time;
    if (delta > ms_in_a_day) {
      console.warn("get unexpected click time");
      continue;
    }
    var delta = ms_in_a_day - delta;
    var x = tw * delta / ms_in_a_day;
    if (click.button == 1) {
      ctx.fillStyle = 'white';
    } else if (click.button == 2) {
      ctx.fillStyle = 'yellow';
    } else if (click.button == 3) {
      ctx.fillStyle = '#888';
    } else {
      console.warn("get unexpected click button");
    } 

    var y = th / 2; // FIXME: GPDS

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI, false);
    ctx.fill();
  }

}
