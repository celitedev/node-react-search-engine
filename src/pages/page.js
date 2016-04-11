import React from 'react';
import { pushState } from 'redux-router';
import _ from 'lodash';

import { connect } from 'redux-simple';

import {
  HIDE_ALL_FORMS,
  SWITCH_FORM,
  SWITCH_MODAL,
  EDIT_WIDGET,
  REMOVE_WIDGET,
  ADD_WIDGET,
  PAGE_PREFIX
} from '../actionTypes';
//import { pageReducer, pageReducers } from '../reducers/pages';
//import mergePromise from '../utils/mergePromise';

export const pagePropTypes = {
  form: React.PropTypes.object.isRequired,
  modal: React.PropTypes.object.isRequired,
  widget: React.PropTypes.object.isRequired
};

function getPageState(state, props, reducerName, extraStateMapper) {
  return Object.assign(
    {},
    state[reducerName],
    _.pick(state, 'modal', 'form', 'widget'),
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
    if (!component.propTypes) {
      component.propTypes = pagePropTypes;
    }
    //const reducerName = `${PAGE_PREFIX}${name}`;
    const reducerName = name;
    const wrapper = connect(
      (state, props) => {
        return getPageState(state, props, reducerName, extraStateMapper);
      },
      (dispatch, props) => getPageDispatch(dispatch, props, dispatchMapper)

    )(component);

    return wrapper;
  };
}
