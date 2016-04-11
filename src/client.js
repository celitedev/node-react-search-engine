/* eslint no-console: 0 */

import './mocks';
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter, ReduxRouter } from 'redux-router';
import domready from 'domready';
import _ from 'lodash';
// import sagaMiddleware from 'redux-saga';
import { Provider } from 'redux-simple';

import routes from './routes';

import reducers from './reducers';
import { LOGIN, API_REQUEST, ENABLE_FETCHER } from './actionTypes';
import rafScheduler from './middleware/rafScheduler';
import thunk from './middleware/thunk';
import logger from './middleware/logger';
import fetcher from './middleware/fetcher';
import triplet from './middleware/triplet';
import api from './middleware/api';
import redirect from './middleware/redirect';
import loginRedirect from './middleware/loginRedirect';
import createHistory from './history';
// import sagas from './sagas/all';

// import Form from 'react-formal';
// import BetterRadioGroup from './components/widgets/BetterRadioGroup';
// import BetterCheckbox from './components/widgets/BetterCheckbox';
// import Selectize from './components/widgets/Selectize';
// import Suggest from './components/widgets/Suggest';
// import Masked from './components/widgets/Masked';
// import SplitDate from './components/widgets/SplitDate';
//
// Form.addInputTypes({
//   'masked': Masked,
//   'better-checkbox': BetterCheckbox,
//   'suggest': Suggest,
//   'selectize': Selectize,
//   'radio-group': BetterRadioGroup,
//   'split-date': SplitDate
// });

const middlewares = [
  thunk,
  triplet,
  api,
  rafScheduler,
  redirect,
  loginRedirect,
  fetcher
];

function skipMiddlewares(key, ...args) {
  try {
    if (!_.isEmpty(localStorage.getItem(key))) {
      console.warn('skip middlewares: %s', key);
      for (const md of args) {
        middlewares.splice(middlewares.indexOf(md), 1);
      }
    }
  } catch (err) {
    // pass
  }
}

skipMiddlewares('skipAuth', loginRedirect);

try {
  const debugConfig = localStorage.getItem('debug');
  if (/.*logger.*/.test(debugConfig)) {
    middlewares.push(logger);
  }
} catch (err) {
  console.error(err);
}

const store = compose(
  reduxReactRouter({ routes, createHistory }),
  applyMiddleware.apply(null, middlewares)
)(createStore)(reducers, window.reduxState);

function render() {
  domready(() => {
    const root = document.getElementById('react-app');

    ReactDOM.render((
      <Provider store={store}>
        <ReduxRouter />
      </Provider>
    ), root);
  });
}

function authenticate(user) {
  store.dispatch({
    type: LOGIN,
    user
  });
}

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    const user = window.reduxState.auth.user;
    if (user) {
      authenticate(user);
    }
  } else {
    try {
      const user = await store.dispatch({
        type: API_REQUEST,
        method: 'get',
        path: '/me'
      });
      authenticate(user[0]);
    } catch (err) {
       // pass
    }
  }
  store.dispatch({
    type: ENABLE_FETCHER
  });
  render();
}

bootstrap();
