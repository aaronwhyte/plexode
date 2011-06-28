/**
 * leaves p0 towards p1, passes through p3 from dir of p2 
 * B(t) = 
 *     (1 - t)^3       * p0 +
 * 3 * (1 - t)^2 * t   * p1 +
 * 3 * (1 - t)   * t^2 * p2 +
 *                 t^3 * p3
 */
function cubicBezier(p0, p1, p2, p3, t, out) {
  var c0 = (1 - t) * (1 - t) * (1 - t);
  var c1 = 3 * (1 - t) * (1 - t) * t;
  var c2 = 3 * (1 - t) * t * t;
  var c3 = t * t * t;
  out.x =
    c0 * p0.x +
    c1 * p1.x +
    c2 * p2.x +
    c3 * p3.x;
  out.y =
    c0 * p0.y +
    c1 * p1.y +
    c2 * p2.y +
    c3 * p3.y;
  return out;
}

function cubicBezierChain(points, t, out) {
  var numBeziers = points.length / 2 - 1;
  var bezierIndex = Math.floor(t * numBeziers);
  var i = bezierIndex * 2;
//  if (bezierIndex > 0) debugger;
  cubicBezier(
      points[i], points[i + 1], points[i + 2], points[i + 3],
      t * numBeziers - bezierIndex,
      out);
}
// The problem is that I want to express (pos,vel,pos,vel)
// but beziers are (pos,control,control,pos)