import createStore, {RESET_STORE} from './createStore';

import {
  LOGIN,
  LOGOUT,
  SHOW_SIGNUP_MODAL,
  HIDE_SIGNUP_MODAL,
  AUTH_MODAL_SHOW,
  AUTH_MODAL_HIDE,
  SET_USER,
  FINISH_APPLICATION,
  ACCOUNT_SUSPENDED_MODAL_SHOW,
  ACCOUNT_SUSPENDED_MODAL_HIDE
} from '../actionTypes';

export default createStore({
  authenticated: false,
  user: null,
  showModal: false,
  showAccountSuspendedModal: false,
  modalReason: null,
  showSignUpModal: false
}, {
  [SET_USER]: (state, action) => ({user: {...state.user, ...action.user}}),

  [LOGIN]: (state, action) => ({user: action.user, authenticated: true, showModal: false, modalReason: null}),

  [LOGOUT]: () => RESET_STORE,

  [AUTH_MODAL_SHOW]: (state, action) => ({showModal: true, modalReason: action.reason}),

  [AUTH_MODAL_HIDE]: () => ({showModal: false, modalReason: null}),

  [ACCOUNT_SUSPENDED_MODAL_SHOW]: () => ({showAccountSuspendedModal: true}),

  [ACCOUNT_SUSPENDED_MODAL_HIDE]: () => ({showAccountSuspendedModal: false}),

  [FINISH_APPLICATION]: (state) => ({user: {...state.user, tutorApplicationSent: true}}),

  [SHOW_SIGNUP_MODAL]: () => ({showSignUpModal: true}),
  [HIDE_SIGNUP_MODAL]: () => ({showSignUpModal: false})

});
