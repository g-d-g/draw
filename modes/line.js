function LineMode(modeManager, draw) {
  Mode.call(this, modeManager, draw);
  this.lines = [];
  this.polygons = [];
  this.line = null;
  this.current = [];
}

LineMode.prototype = Object.create(Mode.prototype);

LineMode.prototype.deactivate = function() {
  this.draw.dirty();
}

LineMode.prototype.keydown = function(event) {

  switch (event.keyCode) {

    case 27: // escape
      this.line = null;
      Array.prototype.push.apply(this.draw.renderables, this.current);
      this.current = [];
      this.modeManager.exit();
      return true;
    break;

    case 67: // [c]lose
      // TODO: add undo
      var points = [];
      this.current.forEach(function(line) {
        line.computeGeometry(points);
      });

      this.current = [];

      var poly = new Polygon(points).clean();
      this.draw.renderables.push(poly);
      return true;
    break;

    default:
      console.log('unhandled key', event.keyCode);
    break;
  }
};

LineMode.prototype.mousemove = function(event) {
  if (this.line && event && event.position) {
    this.line.end.set(event.position);
    return true;
  }
};

LineMode.prototype.mousedown = function(event) {

  // TODO: track closing of a poly by clicking on the end point

  if (event && event.position) {
    if (this.line) {
      this.line.finalized = true;
    }
    // begin the line
    this.line = new Line(
      new Point(event.position),
      new Point(event.position)
    );

    this.current.push(this.line);

    return true;
  }
};

LineMode.prototype.update = function(ctx, delta) {
  this.lines.forEach(function(line) {
    line.render(ctx, delta);
  });
  this.current.forEach(function(line) {
    line.render(ctx, delta);
  });
};
