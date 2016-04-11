import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import modal from './modal';
import widget from './widget';
import form from './form';

export default combineReducers({
  router,
  modal,
  widget,
  form
});
