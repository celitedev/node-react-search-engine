'use strict';

const os = require('os');
const cluster = require('cluster');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const AnsiConverter = require('ansi-to-html');
const debug = require('debug')('tutor:rendering');

const serverBundle = require('./build/server');

if (cluster.isMaster) {
  const numCpus = os.cpus().length;

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

  app.listen(parseInt(process.env.PORT || 7000, 10));
}
