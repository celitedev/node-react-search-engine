'use strict';

const path = require('path');

const ExternalsPlugin = require('webpack/lib/ExternalsPlugin');

function IgnoreNodeModulesPlugin() {
}

IgnoreNodeModulesPlugin.prototype.apply = function apply(compiler) {
  const externalsPlugin = new ExternalsPlugin('commonjs', (context, request, callback) => {
    if (/node_modules/.test(context)
      && !/react-redux/.test(context)
      && !/redux-router/.test(context)
    ) {
      let res;
      if (request[0] === '.') {
        res = path.resolve(context, request);
      } else {
        res = request;
      }
      callback(null, res, 'commonjs');
    } else {
      if (request[0] === '.'
        || /react-redux/.test(request)
        || /redux-router/.test(request)
        || /\.css$/.test(request)
        || /!/.test(request)
      ) {
        callback(null, undefined);
      } else {
        callback(null, request, 'commonjs');
      }
    }
  });
  externalsPlugin.apply(compiler);
};

module.exports = IgnoreNodeModulesPlugin;
