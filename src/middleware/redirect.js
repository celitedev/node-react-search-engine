import {getHistory} from '../history';
import {REDIRECT} from '../actionTypes';

export default () => next => action => {
  if (action.type === REDIRECT) {
    getHistory().pushState(action.state, action.path, action.query);
  }

  return next(action);
};
