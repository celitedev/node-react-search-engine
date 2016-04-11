import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-router';

import auth from './auth';
import fetcher from './fetcher';
import pages from './pages';
import form from './form';
import modal from './modal';
import widget from './widget';

export default combineReducers({
  router,
  auth,
  fetcher,
  form,
  modal,
  widget,
  ...pages
});
