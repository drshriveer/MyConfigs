slate.configAll({
  defaultToCurrentScreen: true,
  nudgePercentOf: "screenSize",
});

var winSizeSequence = [ 2/3, 1/2, 1/3, 1/4 ];
var nudgeAmounts    = [ 1/3, 1/2, 1/3, 1/4 ];
var directions = {
  any:  "any",
  up:    "up",
  down:  "down",
  left:  "left",
  right: "right",
};
var windowState = {};
var tolerance = 2;

function atTopEdge(win) {
  var screen = slate.screen().visibleRect();
  return tolerance > Math.abs(screen.y - win.topLeft().y);
};
function atBottomEdge(win) {
  var screen = slate.screen().visibleRect();
  return tolerance > (screen.height - win.size().height - win.topLeft().y)
}
function atBottomEdge(win) {
  var screen = slate.screen().visibleRect();
  return tolerance > (screen.height - win.size().height - win.topLeft().y)
}
function atRightEdge(win) {
  var screen = slate.screen().visibleRect();
  return tolerance > (screen.width - win.size().width - win.topLeft().x)
};
function atLeftEdge(win) {
  return tolerance > win.topLeft().x
};
function getWindowState(win) {
  var id = win.pid();
  if (windowState[id] === undefined) {
    windowState[id] = {
      lastMove: directions.any,
      vertIter: 0,
      horizontalIter: 0,
    };
  }
  return windowState[id];
};

// Hints: (this doesn't do anything useful yet)
slate.bind("esc:cmd", function(win) {
  win.doOperation(slate.operation("hint"));
});

// Fill Screen Window:
_.each([directions.up, directions.down], (direction) => {
  slate.bind(direction +":ctrl;alt;cmd", function(win) {
    var ws = getWindowState(win);
    var screen = slate.screen().visibleRect();

    win.topLeft().y
    win.doOperation(slate.operation("move", {
      x: screen.x,
      y: screen.y,
      width: screen.width,
      height: screen.height,
    }));

    ws.lastMove = directions.any;
    ws.vertIter = 0;
    ws.horizontalIter = 0;
  });
});

// Throw window between monitors:
_.each([directions.left, directions.right], (direction) => {
  slate.bind(direction + ":ctrl;alt;cmd", function(win) {
    win.doOperation(slate.operation("throw", {
      screen: direction,
    }));
  });
});

// Resizing & moving sides:
function pushUp(win) {
  var ws = getWindowState(win);
  var screen = slate.screen().rect();
  var oldMove = ws.lastMove;
  ws.lastMove = directions.up;

  // determine if we should resize, and what to resize to:
  let width = win.size().width;
  let height = win.size().height;
  var shouldResize = oldMove === directions.up || oldMove === directions.any || atTopEdge(win);
  if (shouldResize) {
    if (ws.vertIter >= 3) {
      ws.vertIter = 0;
      height = screen.height
    } else {
      if (oldMove === directions.any) {
        width = screen.width;
      }
      height = screen.height * winSizeSequence[ws.vertIter];
      ws.vertIter++;
    }
  }

  win.doOperation(slate.operation("move", {
    x: win.topLeft().x,
    y: screen.y,
    width: width,
    height: height,
  }));
};

function pushDown(win) {
  var ws = getWindowState(win);
  var screen = slate.screen().rect();
  var oldMove = ws.lastMove;
  ws.lastMove = directions.down;

  // determine if we should resize, and what to resize to:
  let width = win.size().width;
  let height = win.size().height;
  var shouldResize = oldMove === directions.down || oldMove === directions.any || atBottomEdge(win);
  if (shouldResize) {
    if (ws.vertIter >= 3) {
      ws.vertIter = 0;
      height = screen.height;
    } else {
      if (oldMove === directions.any) {
        width = screen.width;
      }
      height = screen.height * winSizeSequence[ws.vertIter];
      ws.vertIter++;
    }
  }

  win.doOperation(slate.operation("move", {
    x: win.topLeft().x,
    y: screen.height - height,
    width: width,
    height: height,
  }));
};

function pushRight(win) {
  var ws = getWindowState(win);
  var screen = slate.screen().rect();
  var oldMove = ws.lastMove;
  ws.lastMove = directions.right;

  // determine if we should resize, and what to resize to:
  let width = win.size().width;
  let height = win.size().height;
  var shouldResize = oldMove === directions.right || oldMove === directions.any || atRightEdge(win);
  if (shouldResize) {
    if (ws.horizontalIter >= 4) {
      ws.horizontalIter = 0;
      width = screen.width;
    } else {
      if (oldMove === directions.any) {
        height = screen.height;
      }
      width = screen.width * winSizeSequence[ws.horizontalIter];
      ws.horizontalIter++;
    }
  }

  win.doOperation(slate.operation("move", {
    x: screen.width - width,
    y: win.topLeft().y,
    width: width,
    height: height,
  }));
};

function pushLeft(win) {
  var ws = getWindowState(win);
  var screen = slate.screen().rect();
  var oldMove = ws.lastMove;
  ws.lastMove = directions.left;

  // determine if we should resize, and what to resize to:
  let width = win.size().width;
  let height = win.size().height;
  var shouldResize = oldMove === directions.left || oldMove === directions.any || atLeftEdge(win);
  if (shouldResize) {
    if (ws.horizontalIter >= 4) {
      ws.horizontalIter = 0;
      width = screen.width;
    } else {
      if (oldMove === directions.any) {
        height = screen.height;
      }
      width = screen.width * winSizeSequence[ws.horizontalIter];
      ws.horizontalIter++;
    }
  }

  win.doOperation(slate.operation("move", {
    x: screen.x,
    y: win.topLeft().y,
    width: width,
    height: height,
  }));
}

function getNudgeFactor(iter, max) {
  if (iter >= max) {
    iter = 2;
  } else {
    iter--;
  }
  return nudgeAmounts[iter]
}

function nudgeUp(win) {
  var ws = getWindowState(win);
  var screen = slate.screen().visibleRect();

  if (atTopEdge(win)) {
    return;
  }

  if (ws.lastMove == directions.any) {
    pushUp(win);
    return;
  }

  win.doOperation(slate.operation("move", {
    x: win.topLeft().x,
    y: win.topLeft().y - screen.height * getNudgeFactor(ws.vertIter, 3),
    width: win.size().width,
    height: win.size().height,
  }));
};

function nudgeDown(win) {
  var ws = getWindowState(win);
  var screen = slate.screen().visibleRect();

  if (atBottomEdge(win)) {
    return;
  }

  if (ws.lastMove == directions.any) {
    pushDown(win);
    return;
  }

  win.doOperation(slate.operation("move", {
    x: win.topLeft().x,
    y: win.topLeft().y + screen.height * getNudgeFactor(ws.vertIter, 3),
    width: win.size().width,
    height: win.size().height,
  }));
};

function nudgeLeft(win) {
  var ws = getWindowState(win);
  var screen = slate.screen().visibleRect();

  if (atLeftEdge(win)) {
    return;
  }

  if (ws.lastMove == directions.any) {
    pushLeft(win);
    return;
  }

  win.doOperation(slate.operation("move", {
    x: win.topLeft().x - screen.width * getNudgeFactor(ws.horizontalIter, 4),
    y: win.topLeft().y,
    width: win.size().width,
    height: win.size().height,
  }));
};

function nudgeRight(win) {
  var ws = getWindowState(win);
  var screen = slate.screen().visibleRect();

  if (atRightEdge(win)) {
    return;
  }

  if (ws.lastMove == directions.any) {
    pushRight(win);
    return;
  }

  win.doOperation(slate.operation("move", {
    x: win.topLeft().x + screen.width * getNudgeFactor(ws.horizontalIter, 4),
    y: win.topLeft().y,
    width: win.size().width,
    height: win.size().height,
  }));
};

function safeHandler(handler) {
  return function(win) {
    if (win == null) {
      return;
    }
    handler(win);
  }
}

slate.bind("up:alt;cmd", safeHandler(nudgeUp));
slate.bind("down:alt;cmd", safeHandler(nudgeDown));
slate.bind("left:alt;cmd", safeHandler(nudgeLeft));
slate.bind("right:alt;cmd", safeHandler(nudgeRight));

slate.bind("up:ctrl;alt", safeHandler(pushUp));
slate.bind("down:ctrl;alt", safeHandler(pushDown));
slate.bind("left:ctrl;alt", safeHandler(pushLeft));
slate.bind("right:ctrl;alt", safeHandler(pushRight));
