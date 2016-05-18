import createStore, {RESET_STORE} from './createStore';

import {
  LOGIN,
  LOGOUT,
  SET_USER
} from '../actionTypes';

export default createStore({
  authenticated: false,
  user: null,
  modalReason: null
}, {
  [SET_USER]: (state, action) => ({user: {...state.user, ...action.user}}),

  [LOGIN]: (state, action) => ({user: action.user, authenticated: true, showModal: false, modalReason: null}),

  [LOGOUT]: () => RESET_STORE
});
