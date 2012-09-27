// gameutil.js
// copyright 2005, Aaron Whyte
// TODO: move this to gaam?

var VK_UP=38, VK_RIGHT=39, VK_DOWN=40, VK_LEFT=37; // arrows
var VK_SPACE = 32;
var VK_C = 67, VK_P = 80, VK_S = 83;
var VK_I = 73, VK_L = 76, VK_K = 75, VK_J = 74;
var VK_Z = 90, VK_X = 88;
var VK_BACKSLASH = 220;
var VK_SEMICOLON = 186, VK_Q = 81;
var GU_keys = [];

var GU_timeoutId = null;
var GU_clientFunc;
var GU_infoDiv;
var GU_running = true;

var GU_lastMeasureTime = -1;
var GU_targetPeriod;
var GU_nextDelay;

function GU_start(func, opt_fps) {
  var fps = opt_fps || 60;
  GU_targetPeriod = 1000 / fps;
  GU_nextDelay = Math.floor(GU_targetPeriod);
  GU_clientFunc = func;
  GU_startKeyListener();

  GU_clock();
}

function GU_startKeyListener() {
  document.onkeydown = GU_keyDown;
  document.onkeypress = null; // GU_keyDown;
  document.onkeyup = GU_keyUp;
}

function GU_clock() {
  GU_clientFunc();
  var now = (new Date()).getTime();
  var actualPeriod = now - GU_lastMeasureTime;
  GU_lastMeasureTime = now;
  GU_nextDelay += actualPeriod > GU_targetPeriod ? -1 : 1;
  if (GU_nextDelay < 1) GU_nextDelay = 0;
  setTimeout(GU_clock, GU_nextDelay, null);
}
function GU_keyDown(e) {
  if (!e) e = window.event;
  var key = e.keyCode;
  var shift = e.shiftKey;
  GU_keys[key] = true;
}

function GU_keyUp(e) {
  var key = -1;
  var shift;
  if (e && e.which) {
    // NS
    key = e.which;
    shift = e.shiftKey;
  } else {
    // IE
    key = window['event'].keyCode;
    shift = window['event'].shiftKey;
  }

  GU_keys[key] = false;
}

function GU_copyKeysVec(vec) {
  vec.setXY(
      (GU_keys[VK_LEFT] ? -1 : 0) + (GU_keys[VK_RIGHT] ? 1 : 0),
      (GU_keys[VK_UP] ? -1 : 0) + (GU_keys[VK_DOWN] ? 1 : 0));
  return vec;
}

function GU_copyCustomKeysVec(vec, up, right, down, left) {
  vec.setXY(
      (GU_keys[left] ? -1 : 0) + (GU_keys[right] ? 1 : 0),
      (GU_keys[up] ? -1 : 0) + (GU_keys[down] ? 1 : 0));
  return vec;
}

