var aabb = {};
aabb.rectCircleDist = function(x0, y0, x1, y1, cx, cy) {
  var lowX = Math.min(x0, x1);
  var highX = Math.max(x0, x1);
  var lowY = Math.min(y0, y1);
  var highY = Math.max(y0, y1);

  if (cx < lowX) {
    // left column
    if (cy < lowY) {
      return Vec2d.distance(lowX, lowY, cx, cy);
    } else if (cy > highY) {
      return Vec2d.distance(lowX, highY, cx, cy);
    } else {
      return lowX - cx;
    }
  } else if (cx > highX) {
    // right column
    if (cy < lowY) {
      return Vec2d.distance(highX, lowY, cx, cy);
    } else if (cy > highY) {
      return Vec2d.distance(highX, highY, cx, cy);
    } else {
      return cx - highX;
    }
  } else {
    // middle column
    if (cy < lowY) {
      return lowY - cy;
    } else if (cy > highY) {
      return cy - highY;
    } else {
      // in the rect
      return 0;
    }
  }
};