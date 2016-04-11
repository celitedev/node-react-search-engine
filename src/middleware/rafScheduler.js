import raf from 'raf';

export default () => next => {
  let queuedActions = [];
  let frame = null;
  let maybeRaf;

  function loop() {
    frame = null;
    try {
      if (queuedActions.length) {
        next(queuedActions.shift());
      }
    } finally {
      maybeRaf();
    }
  }

  maybeRaf = () => {
    if (queuedActions.length && !frame) {
      frame = raf(loop);
    }
  };

  return action => {
    if (!action.meta || !action.meta.raf) {
      return next(action);
    }

    queuedActions.push(action);
    maybeRaf();

    return function cancel() {
      queuedActions = queuedActions.filter(a => a !== action);
    };
  };
};
