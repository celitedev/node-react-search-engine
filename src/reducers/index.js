import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-router';

import auth from './auth';
import fetcher from './fetcher';
import pages from './pages';
import collection from './collection';
import card from './card';

export default combineReducers({
  router,
  auth,
  collection,
  card,
  fetcher,
  ...pages
});
