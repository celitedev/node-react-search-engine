/* eslint no-console: 0 */

import { API_REQUEST } from '../actionTypes';
import api from '../api';

const debug = require('debug')('tutor:api');

export default store => next => action => {
  if (action.type === API_REQUEST) {
    debug('api request %s %s', action.method, action.path, action.query || null, action.data || null);
    const { session } = store.getState();
    return api.request(action.method, action.path, action.data, action.query, session);
  }

  return next(action);
};
