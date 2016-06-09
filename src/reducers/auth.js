import createStore from './createStore';

import {
  LOGIN,
  LOGOUT,
  SET_USER
} from '../actionTypes';

export default createStore({
  authenticated: false,
  user: null,
  loginModal: false
}, {
  [SET_USER]: (state, action) => ({user: {...state.user, ...action.user}, authenticated: true}),

  [LOGIN]: (state, action) => ({loginModal: !state.loginModal}),

  [LOGOUT]: () => ({authenticated: false, user: null})
});
