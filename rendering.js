'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const url = require('url');
const https = require('https');
const cluster = require('cluster');
const express = require('express');
const cookieParser = require('cookie-parser');
const AnsiConverter = require('ansi-to-html');
const debug = require('debug')('tutor:rendering');
const horizon = require('@horizon/server');
const proxy = require('proxy-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.babel2');
const compiler = webpack(webpackConfig);

const serverBundle = require('./build/server');

const privateKey = fs.readFileSync('./certs/my-private-root-ca.privkey.pem', 'utf8');
const certificate = fs.readFileSync('./certs/my-private-root-ca.cert.pem', 'utf8');

if (cluster.isMaster) {
  const numCpus = 1;//os.cpus().length;

  for (let i = 0; i < numCpus; i++) {
    cluster.fork();
  }
} else {
  const ansiConverter = new AnsiConverter();

  const app = express();
  app.use(cookieParser());

  let statsCache;

  const readStatsProd = callback => {
    if (!statsCache) {
      statsCache = JSON.parse(fs.readFileSync('webpack-stats.json', 'utf-8'));
    }
    if (statsCache.status === 'done') {
      callback(null, statsCache.chunks);
    } else {
      callback(statsCache.error || new Error('webpack stats error'), null);
    }
  };

  const readStatsDev = callback => {
    fs.readFile('webpack-stats.json', 'utf-8', (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        const stats = JSON.parse(data);
        if (stats.status === 'done') {
          callback(null, stats.chunks);
        } else if (stats.status === 'error') {
          callback(ansiConverter.toHtml(stats.message), null);
        } else {
          setTimeout(() => {
            readStatsDev(callback);
          }, 1000);
        }
      }
    });
  };

  const renderApp = process.env.NODE_ENV === 'production' ? serverBundle.renderFull : serverBundle.renderHtml;

  const readStats = process.env.NODE_ENV === 'production' ? readStatsProd : readStatsDev;

  // app.use('/build', express.static(path.join(process.cwd(), 'build')));
  // app.use('/build', proxy(url.parse('http://localhost:8087/')));
  app.use('/api', proxy(url.parse('http://testing123.kwhen.com:3000')));

  app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: '/'}));
  app.use(webpackHotMiddleware(compiler));

  app.get('*', (req, res, next) => {
    readStats((err, chunks) => {
      if (err && typeof err === 'string') {
        res.send(
          '<html><body style="background: #000; color: #fff"><pre>' +
          err +
          '</pre></body></html>'
        );
      } else if (err) {
        next(err);
      } else {
        renderApp(req.originalUrl, req.cookies, (error, redirectLocation, notFound, render) => {
          if (error) {
            debug('error', error);
            res.status(500).send(error.message || 'Internal server error');
          } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
          } else if (notFound) {
            res.status(404).send(render(chunks));
          } else {
            res.status(200).send(render(chunks));
          }
        });
      }
    });
  });

  const credentials = {key: privateKey, cert: certificate};
  const httpsServer = https.createServer(credentials, app);
  const port = parseInt(process.env.PORT || 7000, 10);
  const server = httpsServer.listen(port, (err) => {
    if (err) {
      console.log(err); // eslint-disable-line
      return;
    }

    console.log(`Express listening at http://localhost:${port}/build`); // eslint-disable-line
  });

  const horizonServer = horizon(server, {
    project_name: 'kwhen',

    rdb_host: '127.0.0.1',
    rdb_port: 28015,

    auto_create_collection: true,
    auto_create_index: true,
    permissions: false,
    auth: {
      // success_redirect: Joi.string().default('/'),
      // failure_redirect: Joi.string().default('/'),
      create_new_users: true,
      new_user_group: 'authenticated',
      token_secret: '3SZCY2JUEB1aDAAAmPcX+vpFCuUoOEEVNkbhs5I5/6ItyiK2QWmV93fd9SyqG/EVYBoz7L+tTsX4VWi+5R8dKw==',
      allow_anonymous: true,
      allow_unauthenticated: true
    }
  });

  const facebook = horizon.auth['facebook'];
  horizonServer.add_auth_provider(facebook, {
    path: 'facebook',
    id: '1268427246519647',
    secret: '251b233dad17bb87af61ae26ee28363a'
  });
  const twitter = horizon.auth['twitter'];
  horizonServer.add_auth_provider(twitter, {
    path: 'twitter',
    id: 'Wvvn8WC3mRWrfX1mNJ1mFmw1W',
    secret: 'BsvWimiWS9DCa1mtg5qOwIH523Ar2eMjVu5pvyuoFOg5huWHRF'
  });

  const google = horizon.auth['google'];
  horizonServer.add_auth_provider(google, {
    path: 'google',
    id: '132749478548-qnes7nh2in6ico5l1kgoh3rq66r225bd.apps.googleusercontent.com',
    secret: 'ydL1nx0vaihoYrllJG9blnSJ'
  });

  const github = horizon.auth['github'];
  horizonServer.add_auth_provider(github, {
    path: 'github',
    id: '36ef2b05270e2a68112e',
    secret: '8cae8179ff5c5d3f2fbc421226b0cfbacbea85df'
  });
}
