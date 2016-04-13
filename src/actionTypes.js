export const BOOTSTRAP = 'BOOTSTRAP';

export const REDIRECT = 'REDIRECT';

export const SET_META = 'SET_META';

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

export const CREATE_COLLECTION = 'CREATE_COLLECTION';
export const UPDATE_COLLECTIION = 'UPDATE_COLLECTION';
export const DELETE_COLLECTION = 'DELETE_COLLECTION';
export const ADD_CARDS = 'ADD_CARDS';
export const CREATE_COLLECTION_MODAL = 'CREATE_COLLECTION_MODAL';
export const UPDATE_COLLECTION_MODAL = 'UPDATE_COLLECTION_MODAL';
export const DELETE_COLLECTION_MODAL = 'DELETE_COLLECTION_MODAL';

export const SEARCH_CARDS = 'SEARCH_CARDS';
export const ADD_CARD_TO_COLLECTION = 'ADD_CARD_TO_COLLECTION';
export const DELETE_CARD_FROM_COLLECTION = 'DELETE_CARD_FROM_COLLECTION';

export const FETCHER_TRIPLET = makeTriplet('FETCHER');
export const [FETCHER_START, FETCHER_SUCCESS, FETCHER_FAILURE] = FETCHER_TRIPLET;


export const CHANGE_MODE_TRIPLET = makeTriplet('CHANGE_MODE');
export const [CHANGE_MODE_START, CHANGE_MODE_SUCCESS, CHANGE_MODE_FAILURE] = CHANGE_MODE_TRIPLET;

export const SET_SESSION = 'SET_SESSION';
export const API_REQUEST = 'API_REQUEST';

export const ACCOUNT_SUSPENDED_MODAL_SHOW = 'ACCOUNT_SUSPENDED_MODAL_SHOW';
export const ACCOUNT_SUSPENDED_MODAL_HIDE = 'ACCOUNT_SUSPENDED_MODAL_HIDE';

export const LOAD_BILLING_INFO_TRIPLET = makeTriplet('LOAD_BILLING_INFO');
export const [LOAD_BILLING_INFO_START, LOAD_BILLING_INFO_SUCCESS, LOAD_BILLING_INFO_FAILURE] = LOAD_BILLING_INFO_TRIPLET;

export const APP_UPLOAD = 'APP_UPLOAD';
export const APP_UPLOAD_TRIPLET = makeTriplet('APP_UPLOAD');
export const [APP_UPLOAD_START, APP_UPLOAD_SUCCESS, APP_UPLOAD_FAILURE] = APP_UPLOAD_TRIPLET;

export const AUTH_MODAL_SHOW = 'AUTH_MODAL_SHOW';
export const AUTH_MODAL_HIDE = 'AUTH_MODAL_HIDE';

export const TOAST_ADD = 'TOAST_ADD';
export const TOAST_REMOVE = 'TOAST_REMOVE';

export const FINISH_APPLICATION = 'FINISH_APPLICATION';

export const SHOW_SIGNUP_MODAL = 'SHOW_SIGNUP_MODAL';
export const HIDE_SIGNUP_MODAL = 'HIDE_SIGNUP_MODAL';
