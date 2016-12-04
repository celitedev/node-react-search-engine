/* eslint no-console: 0 */
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {reduxReactRouter, ReduxRouter} from 'redux-router';
import domready from 'domready';
import _ from 'lodash';
import {Provider} from 'redux-simple';

import routes from './routes';

import reducers from './reducers';
import {LOGIN, SET_USER, ENABLE_FETCHER} from './actionTypes';
import rafScheduler from './middleware/rafScheduler';
import thunk from './middleware/thunk';
import logger from './middleware/logger';
import fetcher from './middleware/fetcher';
import triplet from './middleware/triplet';
import api from './middleware/api';
import redirect from './middleware/redirect';
import loginRedirect from './middleware/loginRedirect';
import answerRedirect from './middleware/answerRedirect';
import createHistory from './history';
import 'material-design-lite';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PatchedHorizonConnector from './patchHorizonConnector';
import {clearAuthToken} from './horizon';

const debug = require('debug')('app:client');

let horizon;

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const middlewares = [
  thunk,
  triplet,
  api,
  rafScheduler,
  redirect,
  loginRedirect,
  answerRedirect,
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

const store = compose(
  reduxReactRouter({routes, createHistory}),
  applyMiddleware.apply(null, middlewares),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(reducers, window.reduxState);

try {
  const debugConfig = localStorage.getItem('debug');
  if (/.*logger.*/.test(debugConfig)) {
    middlewares.push(logger);
  }
} catch (err) {
  console.error(err);
}

function render() {
  domready(() => {
    const root = document.getElementById('react-app');

    ReactDOM.render((
      <Provider store={store}>
        <PatchedHorizonConnector store={store} horizon={horizon}>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
            <ReduxRouter />
          </MuiThemeProvider>
        </PatchedHorizonConnector>
      </Provider>
    ), root);
  });
}

async function bootstrap() {
  store.dispatch({
    type: ENABLE_FETCHER
  });
  if (!process.env.SERVER_RENDERING) {
    horizon = require('@horizon/client')();
    horizon.connect();
    horizon.onSocketError((err) => {
      clearAuthToken();
    });
    horizon.onReady(() => {
      debug('Connected to Horizon server');
      if (horizon.hasAuthToken()) {
        horizon.currentUser().fetch().subscribe((user) => {
          debug('Current user', user);
          if (user.id) {
            store.dispatch({
              type: SET_USER,
              user
            });
          }
        });
      }
    });

    horizon.status(status => debug('Horizon status: ', status.type));
  }
  render();
}
bootstrap();
