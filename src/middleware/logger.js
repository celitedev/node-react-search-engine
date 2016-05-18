/* eslint no-console: 0 */
import _ from 'lodash';

const debug = require('debug')('kwhen:logger');

export default store => next => action => {
  const {type, ...rest} = action;
  let succeed = false;
  if (type && type.substring(0, 2) !== '@@' && type.substring(0, 7) !== 'EFFECT_') {
    if (console.group) {
      console.group(type);
      if (!_.isEmpty(rest)) {
        console.info('payload', rest);
      }
    } else {
      debug(type);
    }
  }
  try {
    const result = next(action);
    succeed = true;
    return result;
  } finally {
    if (type && type.substring(0, 2) !== '@@' && type.substring(0, 7) !== 'EFFECT_') {
      if (console.groupEnd) {
        if (succeed) {
          console.info('next state', store.getState());
          console.groupEnd(type);
        }
      }
    }
  }
};
