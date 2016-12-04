import {ANSWER_REDIRECT} from '../actionTypes';

export default () => next => action => {
  if (action.type === ANSWER_REDIRECT) {
    window.location.assign(action.path);
  }

  return next(action);
};
