slate.configAll({
  defaultToCurrentScreen: true,
});

const winSizeSequence = [ 2/3, 1/2, 1/3, 1/4 ];
const nudgeAmounts    = [ 1/3, 1/2, 1/3, 1/4 ];
const directions = {
  any:  "any",
  up:    "up",
  down:  "down",
  left:  "left",
  right: "right",
};
const windowState = {};
const tolerance = 2;

const atTopEdge = function(win) {
  const screen = slate.screen().visibleRect();
  return tolerance > Math.abs(screen.y - win.topLeft().y);
};
const atBottomEdge = function(win) {
  const screen = slate.screen().visibleRect();
  return tolerance > (screen.height - height - win.topLeft().y)
}
const atBottomEdge = function(win) {
  const screen = slate.screen().visibleRect();
  return tolerance > (screen.height - height - win.topLeft().y)
}
const atRightEdge = function(win) {
  const screen = slate.screen().visibleRect();
  return tolerance > (screen.width - width - win.topLeft().x)
};
const atLeftEdge = function(win) {
  return tolerance > win.topLeft().x
};
const getWindowState = function(win) {
  const id = win.pid();
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
    const ws = getWindowState(win);
    const screen = slate.screen().visibleRect();

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
const pushUp = function(win) {
  const ws = getWindowState(win);
  const screen = slate.screen().visibleRect();
  const oldMove = ws.lastMove;
  ws.lastMove = directions.up;

  // determine if we should resize, and what to resize to:
  let width = win.size().width;
  let height = win.size().height;
  const shouldResize = oldMove === directions.up || oldMove === directions.any || atTopEdge(win);
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

const pushDown = function(win) {
  const ws = getWindowState(win);
  const screen = slate.screen().visibleRect();
  const oldMove = ws.lastMove;
  ws.lastMove = directions.down;

  // determine if we should resize, and what to resize to:
  let width = win.size().width;
  let height = win.size().height;
  const shouldResize = oldMove === directions.down || oldMove === directions.any || atBottomEdge(win);
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

const pushRight = function(win) {
  const ws = getWindowState(win);
  const screen = slate.screen().visibleRect();
  const oldMove = ws.lastMove;
  ws.lastMove = directions.right;

  // determine if we should resize, and what to resize to:
  let width = win.size().width;
  let height = win.size().height;
  const shouldResize = oldMove === directions.right || oldMove === directions.any || atRightEdge(win);
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

const pushLeft = function(win) {
  const ws = getWindowState(win);
  const screen = slate.screen().visibleRect();
  const oldMove = ws.lastMove;
  ws.lastMove = directions.left;

  // determine if we should resize, and what to resize to:
  let width = win.size().width;
  let height = win.size().height;
  const shouldResize = oldMove === directions.left || oldMove === directions.any || atLeftEdge(win);
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

//--------
// Nudge:
//--------------------------------
const nudgeUp = function(win) {
  const ws = getWindowState(win);
  const screen = slate.screen().visibleRect();

  if (atTopEdge(win)) {
    return;
  }

  if (ws.lastMove == directions.any) {
    pushUp(win);
    return;
  }

  win.doOperation(slate.operation("move", {
    x: win.topLeft().x,
    y: win.topLeft().y - screen.width * nudgeAmounts(ws.vertIter),
    width: win.size().width,
    height: win.size().height,
  }));
};

const nudgeDown = function(win) {
  const ws = getWindowState(win);
  const screen = slate.screen().visibleRect();

  if (atBottomEdge(win)) {
    return;
  }

  if (ws.lastMove == directions.any) {
    pushDown(win);
    return;
  }

  win.doOperation(slate.operation("move", {
    x: win.topLeft().x,
    y: win.topLeft().y + screen.width * nudgeAmounts(ws.vertIter),
    width: win.size().width,
    height: win.size().height,
  }));
};

const nudgeLeft = function(win) {
  const ws = getWindowState(win);
  const screen = slate.screen().visibleRect();

  if (atLeftEdge(win)) {
    return;
  }

  if (ws.lastMove == directions.any) {
    pushLeft(win);
    return;
  }

  win.doOperation(slate.operation("move", {
    x: screen.x - screen.width * nudgeAmounts(ws.horizontalIter),
    y: win.topLeft().y,
    width: win.size().width,
    height: win.size().height,
  }));
};

const nudgeRight = function(win) {
  const ws = getWindowState(win);
  const screen = slate.screen().visibleRect();

  if (atRightEdge(win)) {
    return;
  }

  if (ws.lastMove == directions.any) {
    pushRight(win);
    return;
  }

  win.doOperation(slate.operation("move", {
    x: screen.x + screen.width * nudgeAmounts(ws.horizontalIter),
    y: win.topLeft().y,
    width: win.size().width,
    height: win.size().height,
  }));
};


slate.bind("up:alt;cmd", nudgeUp);
slate.bind("down:alt;cmd", nudgeDown);
slate.bind("left:alt;cmd", nudgeLeft);
slate.bind("right:alt;cmd", nudgeRight);

slate.bind("up:ctrl;alt", pushUp);
slate.bind("down:ctrl;alt", pushDown);
slate.bind("left:ctrl;alt", pushLeft);
slate.bind("right:ctrl;alt", pushRight);
