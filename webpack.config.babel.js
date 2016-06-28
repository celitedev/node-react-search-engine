'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const _ = require('lodash');
const yaml = require('js-yaml');
const IgnoreNodeModulesPlugin = require('./IgnoreNodeModulesPlugin');

const production = process.env.NODE_ENV === 'production';
const server = process.env.SERVER_RENDERING;
const hot = process.env.BABEL_ENV === 'hot';

const extractText = production || server;

let outputName;
if (server) {
  outputName = '[name].js';
} else {
  if (hot) {
    outputName = '[name]-[hash].js';
  } else {
    outputName = '[name]-[chunkhash].js';
  }
}

let cssSelectorName;
if (extractText) {
  cssSelectorName = '[name]_[hash:hex:5]';
} else if (process.env.KARMA) {
  cssSelectorName = '[local]';
} else {
  cssSelectorName = '[name]_[local]_[hash:hex:5]';
}

function entry(path, server) {
  const entry = ['babel-polyfill', path];
  if (!server) {
    entry.unshift('./src/styles/global.scss');
  }
  return entry;
}

function hotEntry(items) {
  if (!hot) {
    return items;
  }
  return [
    'webpack-hot-middleware/client'
  ].concat(items);
}

//noinspection JSUnresolvedFunction,JSUnresolvedVariable
const config = {
  context: path.resolve('.'),

  entry: server ? {
    server: entry('./src/server', true)
  } : {
    client: hotEntry(entry('./src/client'))
  },

  output: {
    path: path.resolve('build'),
    filename: outputName,
    publicPath: '/',
    libraryTarget: 'umd'
  },

  resolve: {
    modulesDirectories: ['web_modules', 'node_modules'],
    extensions: ['', '.js', '.scss'],
    alias: {
      'react-redux': 'redux-simple'
    }
  },

  module: {
    noParse: [/sinon\.js/],
    preLoaders: production ? [] : [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\/[A-Z][^\/]*\.js$/,
        exclude: /node_modules/,
        loaders: ['baggage?[file].scss=styles', 'babel']
      },
      {
        test: /\/[a-z][^\/]*\.js$/,
        exclude: /node_modules/,
        loaders: ['babel']
      },
      {
        test: /\.json$/,
        loaders: ['json']
      },
      {
        test: /\/[A-Z][^\/]*\.scss/,
        loader: extractText
          ? ExtractTextPlugin.extract('style', 'css?module&importLoaders=1&localIdentName=' + cssSelectorName + '!postcss?pack=general!sass')
          : 'style!css?module&importLoaders=1&localIdentName=' + cssSelectorName + '!postcss?pack=general!sass'
      },
      {
        test: /\/[a-z][^\/]*\.scss/,
        loader: extractText
          ? ExtractTextPlugin.extract('style', 'css!postcss?pack=general!sass')
          : 'style!css!postcss?pack=general!sass'
      },
      {
        test: /(\/src\/icons\/|\/src\/custom-icons\/|material-design-icons).+\.svg$/,
        loader: 'react-icon'
      },
      {
        test: /\.css$/,
        loader: extractText ? ExtractTextPlugin.extract('style', 'css') : 'style!css'
      },
      {
        test: /\.(gif|png|jpe?g|svg|webp|woff|woff2|ttf|eot|mp3|mp4|webm)(\?.+)?$/,
        loaders: ['file?name=[sha512:hash:base36:7].[ext]'],
        exclude: /(\/src\/icons\/|\/src\/custom-icons\/|material-design-icons)/
      },
      {
        test: /\.yml$/,
        loaders: ['json', 'yaml']
      }
    ]
  },

  eslint: {
    configFile: path.resolve('.eslintrc')
  },

  postcss: {
    general: [
      autoprefixer({
        browsers: ['last 4 versions']
      })
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.SERVER_RENDERING': JSON.stringify(process.env.SERVER_RENDERING || null),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev')
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
  ]
};

if (hot) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

if (server) {

  config.target = 'node';
  config.plugins.push(
    new ExtractTextPlugin('[name]-[contenthash].css', {
      allChunks: true
    }),
    new IgnoreNodeModulesPlugin()
  );

} else { //client

  if (!process.env.KARMA) {
    config.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        minChunks: module => module.resource && module.resource.indexOf('node_modules') !== -1
      })
    );
  }

  config.plugins.push(
    new BundleTracker({filename: './webpack-stats.json'})
  );

  if (!production) {
    config.devtool = 'eval-sourcemap';
    config.devServer = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  } else {

    // config.devtool = 'source-map'; //no need for sourcemaps in production
    config.output.devtoolModuleFilenameTemplate = 'file://[resource-path]';
    config.output.devtoolFallbackModuleFilenameTemplate = 'file://[resource-path]?[hash]';

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    config.plugins.push(
      new webpack.optimize.DedupePlugin(), //shaves ~ 2kb off
      new webpack.optimize.OccurenceOrderPlugin(),
      // new webpack.optimize.UglifyJsPlugin({comments: /a^/, compress: {warnings: false}}),
      new ExtractTextPlugin('[name]-[contenthash].css', {
        allChunks: true
      })
    );
    config.recordsPath = path.resolve('webpack-production-clientRecords.json');
  }

}


module.exports = config;
