export const REDIRECT = 'REDIRECT';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const ENABLE_FETCHER = 'ENABLE_FETCHER';
export const SET_USER = 'SET_USER';

export const PAGE_PREFIX = '@@page';

export function makeTriplet(name) {
  return [
    `${name}_START`,
    `${name}_SUCCESS`,
    `${name}_FAILURE`
  ];
}

export const CREATE_COLLECTION_DIALOG = 'CREATE_COLLECTION_DIALOG';
export const DELETE_COLLECTION = 'DELETE_COLLECTION';
export const ADD_CARDS = 'ADD_CARDS';
export const CREATE_COLLECTION_MODAL = 'CREATE_COLLECTION_MODAL';
export const UPDATE_COLLECTION_MODAL = 'UPDATE_COLLECTION_MODAL';
export const DELETE_COLLECTION_MODAL = 'DELETE_COLLECTION_MODAL';
export const SWITCH_PLACEHOLDER = 'SWITCH_PLACEHOLDER';
export const SWITCH_ADD_CARD_MODAL = 'SWITCH_ADD_CARD_MODAL';
export const SAVE_COLLECTION_INFO = 'SAVE_COLLECTION_INFO';
export const RESET_COLLECTION_INFO = 'RESET_COLLECTION_INFO';
export const EDIT_COLLECTION = 'EDIT_COLLECTION';

export const EDIT_CARD_DESCRIPTION = 'EDIT_CARD_DESCRIPTION';

export const SHARE_CARD_MODAL = 'SHARE_CARD_MODAL';

export const SNACKBAR = 'SNACKBAR';

export const SEARCH_CARDS = 'SEARCH_CARDS';
export const ADD_CARD_TO_COLLECTION = 'ADD_CARD_TO_COLLECTION';
export const DELETE_CARD_FROM_COLLECTION = 'DELETE_CARD_FROM_COLLECTION';

export const FETCHER_TRIPLET = makeTriplet('FETCHER');
export const [FETCHER_START, FETCHER_SUCCESS, FETCHER_FAILURE] = FETCHER_TRIPLET;

export const SET_SESSION = 'SET_SESSION';
export const API_REQUEST = 'API_REQUEST';

export const ACCOUNT_SUSPENDED_MODAL_SHOW = 'ACCOUNT_SUSPENDED_MODAL_SHOW';
export const ACCOUNT_SUSPENDED_MODAL_HIDE = 'ACCOUNT_SUSPENDED_MODAL_HIDE';

export const AUTH_MODAL_SHOW = 'AUTH_MODAL_SHOW';
export const AUTH_MODAL_HIDE = 'AUTH_MODAL_HIDE';

export const TOAST_ADD = 'TOAST_ADD';
export const TOAST_REMOVE = 'TOAST_REMOVE';

export const FINISH_APPLICATION = 'FINISH_APPLICATION';

export const SHOW_SIGNUP_MODAL = 'SHOW_SIGNUP_MODAL';
export const HIDE_SIGNUP_MODAL = 'HIDE_SIGNUP_MODAL';
export const CHANGE_TABBAR = 'CHANGE_TABBAR';

export const ANSWER_REDIRECT = 'ANSWER_REDIRECT';
