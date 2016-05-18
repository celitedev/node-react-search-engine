import _ from 'lodash';

import {
  FETCHER_TRIPLET,
  ENABLE_FETCHER
} from '../actionTypes';

const debug = require('debug')('kwhen:fetcher');

function varyOn(state) {
  const {components, params, location: {query, pathname}} = state.router || {location: {}};
  return {components, params, query, pathname};
}

function getPageConfig(comp, state) {
  const pageConfig = comp.pageConfig || (comp.WrappedComponent && comp.WrappedComponent.pageConfig);
  if (_.isFunction(pageConfig)) {
    return pageConfig(state);
  }
  if (_.isObject(pageConfig)) {
    return pageConfig;
  }
  if (pageConfig) {
    throw new Error('invalid page config');
  }
  return null;
}

export default store => next => {
  debug('init');
  let enabled = false;
  let lastValue = store.getState().fetcher.state;
  return action => {
    const result = next(action);
    if (action.type === ENABLE_FETCHER) {
      debug('enable');
      enabled = true;
    }

    if (enabled) {
      const storeState = store.getState();
      const currentValue = varyOn(storeState);

      currentValue.fetchState = {};
      currentValue.components.forEach(comp => {
        const pageConfig = getPageConfig(comp, storeState);
        if (pageConfig) {
          currentValue.fetchState = {
            ...currentValue.fetchState,
            ...pageConfig.fetchState(storeState)
          };
        }
      });

      const lastComparable = _.omit(lastValue, 'components');
      const currentComparable = _.omit(currentValue, 'components');

      if (enabled && !_.isEqual(lastComparable, currentComparable)) {
        lastValue = currentValue;
        debug('changed by %s', action.type, lastComparable, currentComparable);
        const fetches = [];
        currentValue.components.forEach(comp => {
          const pageConfig = getPageConfig(comp, storeState);
          if (pageConfig) {
            fetches.push(pageConfig.fetchData({
              ...(pageConfig ? pageConfig.fetchState(storeState) : {}),
              dispatch: store.dispatch,
              params: currentValue.params,
              query: currentValue.query
            }));
          }
        });
        if (fetches.length) {
          store.dispatch({
            triplet: FETCHER_TRIPLET,
            promise: Promise.all(fetches.map(fetch => fetch.promise)),
            extra: {
              state: currentComparable
            }
          });
          fetches.forEach(fetch => {
            store.dispatch(fetch);
          });
        }
      }
    }
    return result;
  };
};
