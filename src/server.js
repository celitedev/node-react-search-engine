/* eslint no-console: 0 */

import React from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import {createStore, applyMiddleware, compose} from 'redux';
import {ReduxRouter} from 'redux-router';
import {reduxReactRouter, match} from 'redux-router/server';
import {Provider} from 'redux-simple';
import _ from 'lodash';

import Html from './components/Html';
import {
  SET_SESSION,
  API_REQUEST,
  LOGIN,
  ENABLE_FETCHER
} from './actionTypes';

import routes from './routes';

import reducers from './reducers';
import thunk from './middleware/thunk';
import logger from './middleware/logger';
import fetcher from './middleware/fetcher';
import triplet from './middleware/triplet';
import api from './middleware/api';

const debug = require('debug')('kwhen:server');

const middlewares = [thunk, api, triplet, fetcher, logger];

async function tryAuthenticate(store, cookies) {
  if (!cookies || !cookies.sessionid) {
    return;
  }

  await Promise.resolve(store.dispatch({
    type: SET_SESSION,
    sessionid: cookies.sessionid
  }));

  try {
    const user = await store.dispatch({
      type: API_REQUEST,
      method: 'get',
      path: '/me/'
    });
    await Promise.resolve(store.dispatch({
      type: LOGIN,
      user
    }));
  } catch (error) {
    // pass
  }
}

function promisedMatch(store, location) {
  return new Promise(resolve => {
    store.dispatch(match(location, (error, redirect) => {
      if (error) {
        debug('error', error);
        resolve({error});
        return;
      }
      if (redirect) {
        debug('redirect', redirect);
        resolve({redirect});
        return;
      }

      const state = store.getState();
      const {components} = state.router;
      const {authenticated} = state.auth;
      if (!authenticated) {
        for (const comp of components) {
          if (comp.loginRequired || (comp.WrappedComponent && comp.WrappedComponent.loginRequired)) {
            debug('auth redirect');
            resolve({redirect: {pathname: '/', search: ''}});
            return;
          }
        }
      }

      store.dispatch({
        type: ENABLE_FETCHER
      });

      if (store.getState().fetcher.loading) {
        const unsubscribe = store.subscribe(() => {
          if (!store.getState().fetcher.loading) {
            unsubscribe();
            resolve({});
          }
        });
        return;
      }

      resolve({});
    }));
  });
}

export async function renderFull(location, cookies, callback) {
  debug('begin');

  const store = compose(
    reduxReactRouter({routes}),
    applyMiddleware.apply(null, middlewares)
  )(createStore)(reducers);

  await tryAuthenticate(store, cookies);

  const {error, redirect, notFound} = await promisedMatch(store, location);

  if (notFound) {
    debug('not found');
  }

  if (error || redirect) {
    callback(error, redirect);
  } else {
    debug('done');
    const state = store.getState();
    const markup = renderToString(
      <Provider store={store}>
        <ReduxRouter />
      </Provider>
    );
    const cleanState = _.omit(state, 'router', 'session');
    callback(null, null, notFound, chunks => {
      const html = renderToStaticMarkup(<Html state={cleanState} chunks={chunks} markup={markup}/>);
      return '<!DOCTYPE html>' + html;
    });
  }
}

export function renderHtml(location, cookies, callback) {
  callback(null, null, null, chunks => {
    return renderToStaticMarkup(<Html chunks={chunks} markup=''/>);
  });
}
