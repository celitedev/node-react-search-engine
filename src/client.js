/* eslint no-console: 0 */

import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter, ReduxRouter } from 'redux-router';
import domready from 'domready';
import _ from 'lodash';
import sagaMiddleware from 'redux-saga';
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
import sagas from './sagas/all';
import Form from 'react-formal';
// import FakeRest from 'fakerest';
// import sinon from 'sinon';
// //Fake API
// (() => {
//   const data = {
//     'authors': [
//       { id: 0, first_name: 'Leo', last_name: 'Tolstoi' },
//       { id: 1, first_name: 'Jane', last_name: 'Austen' }
//     ],
//     'books': [
//       { id: 0, author_id: 0, title: 'Anna Karenina' },
//       { id: 1, author_id: 0, title: 'War and Peace' },
//       { id: 2, author_id: 1, title: 'Pride and Prejudice' },
//       { id: 3, author_id: 1, title: 'Sense and Sensibility' }
//     ]
//   };
//   const restServer = new FakeRest.Server('http://localhost:7000/');
//
//   restServer.init(data);
//
//   const server = sinon.fakeServer.create();
//   server.respondWith(restServer.getHandler());
//
//   const req = new XMLHttpRequest();
//   req.open('GET', '/authors', false);
//   req.send(null);
//   console.log(req.responseText);
// })();

const middlewares = [
  api
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

/*try {
  const debugConfig = localStorage.getItem('debug');
  if (/.*logger.*!/.test(debugConfig)) {
    middlewares.push(logger);
  }
} catch (err) {
  console.error(err);
}*/

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
    //try {
    //  const user = await store.dispatch({
    //    type: API_REQUEST,
    //    method: 'get',
    //    path: '/me/'
    //  });
    //  authenticate(user);
    //} catch (err) {
    //  // pass
    //}
  }
  //store.dispatch({
  //  type: ENABLE_FETCHER
  //});
  render();
}

bootstrap();
