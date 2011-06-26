function log(text, color) {
  var div = gebi('log');
  if (!div) {
    div = ce('div', document.body);
    div.id = 'log';
  }
  var html = [
    '<span',
    color ? ' style="color:' + color + '"' : '',
    '>',
    textToHtml(text),
    '</span>'].join('');
  div.innerHTML += html;
}

function logln(text, color) {
  log(text + '\n', color);
}

var TEST_FUNC_NAME_RE = /(function )?(test[a-zA-Z0-9_$]*)/;
function getTestFunctionNameFromStack() {
  var caller = arguments.callee.caller;
  while(caller) {
    var m = TEST_FUNC_NAME_RE.exec(caller.toString());
    if (m) return m[2];
    caller = caller.caller;
  }
}

var failed = false;
function fail(message) {
  failed = true;
  logln('FAILED: ' + message, '#800');
  
}

function assertEquals(expected, actual) {
  if (expected !== actual) {
    var msg = 'expected: ' + expected + ', actual: ' + actual; 
    fail(msg);
    throw msg;
  }
}

var tests = [];
function addTest(testFunc) {
  tests.push(testFunc);
}

function runTests() {
  for (var i = 0; i < tests.length; i++) {
    failed = false;
    var test = tests[i];
    logln(test.name + '...');
    tests[i]();
    if (!failed) {
      logln('passed', '#080');
    }
  }
  logln('Finished all tests.');
}

