'use strict';

require("colors");
const os = require('os');
const fs = require('fs');
const path = require('path');
const url = require('url');
const https = require('https');
const cluster = require('cluster');
const express = require('express');
const cookieParser = require('cookie-parser');
const AnsiConverter = require('ansi-to-html');
const debug = require('debug')('app:rendering');
const horizon = require('@horizon/server');
const hz = require('horizon/src/serve');
const proxy = require('proxy-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.babel');
const compiler = webpack(webpackConfig);
const yaml = require('js-yaml');

const serverBundle = require('./build/server');

const env = (process.env.NODE_ENV || "dev").toLowerCase();
const envConfig = './config/config-' + process.env.NODE_ENV + '.yml';
const configHorizonPath = path.resolve(".hz/config-"+env+".toml");

let _config;
let horizonConfig;

try {
  _config = yaml.safeLoad(fs.readFileSync(envConfig, 'utf-8'));
} catch (err) {
  throw 'CONFIG NOT FOUND FOR FOR ENV=' + env;
}

try {
  fs.readFileSync(configHorizonPath, 'utf-8'); //throws if not found
  horizonConfig = hz.read_config_from_file(null, configHorizonPath);
} catch (err) {
  console.log(err);
  throw 'HORIZON CONFIG NOT FOUND FOR FOR ENV=' + env;
}

const privateKey = fs.readFileSync(_config.keyPath, 'utf-8');
const certificate = fs.readFileSync(_config.certPath, 'utf-8');
let sslChain;

if(_config.sslChainPath){
  sslChain = fs.readFileSync(_config.sslChainPath, 'utf-8');
}

if(!privateKey){
  throw "PRIVATE KEY NOT FOUND: " + privateKey;
}

if(!certificate){
  throw "CERTIFICATE NOT FOUND: " + certificate;
}

function startHorizonServer(servers) {
  let opts = horizonConfig;
  console.log('Starting Horizon...');
  const hzServer = new horizon.Server(servers, {
    auto_create_collection: opts.auto_create_collection,
    auto_create_index: opts.auto_create_index,
    permissions: opts.permissions,
    rdb_host: opts.rdb_host,
    rdb_port: opts.rdb_port,
    project_name: opts.project_name,
    auth: {
      token_secret: opts.token_secret,
      allow_unauthenticated: opts.allow_unauthenticated,
      allow_anonymous: opts.allow_anonymous,
      success_redirect: opts.auth_redirect,
      failure_redirect: opts.auth_redirect
    }
  });
  hzServer.ready().then(() => {
    console.log('Horizon ready for connections');
    console.log(("started in mode: " + env).yellow);
  }).catch((err) => {
    console.log(err);
  });
  return hzServer;
}

function addAuthProviders(horizonServer) {
  if (horizonConfig.auth) {
    for (const name in horizonConfig.auth) {
      const provider = horizon.auth[name];
      if (!provider) {
        throw new Error(`Unrecognized auth provider "${name}"`);
      }
      horizonServer.add_auth_provider(provider, Object.assign({}, {path: name}, horizonConfig.auth[name]));
    }
  }
}

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

  app.use('/api', proxy(url.parse(_config.backendUrl)));
  app.use(express.static('build'));
  app.use(express.static('/'));

  if (process.env.NODE_ENV !== 'production') {
    app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: '/'}));
    app.use(webpackHotMiddleware(compiler));
  }

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

  const httpsServer = https.createServer({
    key: privateKey,
    cert: certificate,
    ca: sslChain
  }, app);
  const port = _config.appPort;
  const server = httpsServer.listen(port, (err) => {
    if (err) {
      console.log(err); // eslint-disable-line
      return;
    }

    console.log(`Express listening at http://localhost:${port}/build`); // eslint-disable-line
  });

  const horizonServer = startHorizonServer(server);
  addAuthProviders(horizonServer);
}
