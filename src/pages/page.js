import React from 'react';
import { pushState } from 'redux-router';
import _ from 'lodash';

import { connect } from 'redux-simple';

import {
  PAGE_PREFIX,
  makeTriplet
} from '../actionTypes';
import { pageReducer, pageReducers } from '../reducers/pages';
import mergePromise from '../utils/mergePromise';

export const pagePropTypes = {
  loading: React.PropTypes.bool.isRequired,
  loaded: React.PropTypes.bool.isRequired,
  data: React.PropTypes.object,
  error: React.PropTypes.object,
  user: React.PropTypes.object,
  authenticated: React.PropTypes.bool.isRequired
};

function getPageState(state, props, reducerName, extraStateMapper) {
  return Object.assign(
    {},
    state[reducerName],
    _.pick(state.auth, 'authenticated', 'user'),
    extraStateMapper ? extraStateMapper(state, props) : {}
  );
}

function applyDispatchMapper(dispatch, props, dispatchMapper) {
  if (!dispatchMapper) {
    return {};
  }
  if (_.isFunction(dispatchMapper)) {
    return dispatchMapper(dispatch, props);
  }
  if (_.isObject(dispatchMapper)) {
    return _.mapValues(dispatchMapper, action => (...args) => dispatch(action(...args)));
  }
  throw new Error('invalid dispatch mapper');
}

function getPageDispatch(dispatch, props, dispatchMapper) {
  return Object.assign(
    {
      pushState: (...args) => dispatch(pushState(...args))
    },
    applyDispatchMapper(dispatch, props, dispatchMapper)
  );
}

export function page(name, extraStateMapper, dispatchMapper) {
  return component => {
    const reducerName = `${PAGE_PREFIX}${name}`;
    const tripletName = name.toUpperCase();

    if (!component.propTypes) {
      component.propTypes = pagePropTypes;
    }

    const wrapper = connect(
      (state, props) => getPageState(state, props, reducerName, extraStateMapper),
      (dispatch, props) => getPageDispatch(dispatch, props, dispatchMapper)
    )(component);

    const pageConfig = component.pageConfig = {
      reducerName,
      tripletName,
      fetchState(...args) {
        if (_.isFunction(component.fetchState)) {
          return component.fetchState(...args);
        }
        return {};
      },
      fetchData(...args) {
        let promise = component.fetchData(...args);
        if (_.isPlainObject(promise)) {
          promise = mergePromise(promise);
        }
        return {
          triplet: makeTriplet(tripletName),
          promise
        };
      }
    };

    pageReducers[pageConfig.reducerName] = pageReducer(pageConfig.tripletName);

    return wrapper;
  };
}
