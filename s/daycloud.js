function buildDayCloud(clicks) {
  const canvas = $("#daycloud canvas");
  const tw = canvas.width;
  const th = canvas.height;
  const ctx = canvas.getContext("2d");

  const ms_in_a_day = 24 * 3600 * 1000;
  const now = new Date().getTime();

  for (var click of clicks) {
    var delta = now - click.time;
    if (delta > ms_in_a_day) {
      console.warn("get unexpected click time");
      continue;
    }
    var delta = ms_in_a_day - delta;
    var x = tw * delta / ms_in_a_day;
    if (click.button == 1) {
      ctx.fillStyle = 'rgb(200, 0, 0)';
    } else if (click.button == 2) {
      ctx.fillStyle = 'rgb(0, 200, 0)';
    } else if (click.button == 3) {
      ctx.fillStyle = 'rgb(0, 0, 200)';
    } else {
      console.warn("get unexpected click button");
    } 
    ctx.fillRect(x, 10, 10, 10);
  }

}
