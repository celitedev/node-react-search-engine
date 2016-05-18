import {
  ROUTER_DID_CHANGE
} from 'redux-router/lib/constants';

import {
  REDIRECT,
  AUTH_MODAL_SHOW
} from '../actionTypes';

export default store => next => action => {
  if (action.type === ROUTER_DID_CHANGE) {
    let loginRequired = false;
    for (const comp of action.payload.components) {
      if (comp.loginRequired || (comp.WrappedComponent && comp.WrappedComponent.loginRequired)) {
        loginRequired = true;
      }
    }
    if (loginRequired) {
      const {authenticated} = store.getState().auth;
      if (!authenticated) {
        store.dispatch({
          type: REDIRECT,
          path: '/'
        });
        return store.dispatch({
          type: AUTH_MODAL_SHOW
        });
      }
    }
  }
  return next(action);
};
