'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const BundleTracker = require('webpack-bundle-tracker');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IgnoreNodeModulesPlugin = require('./IgnoreNodeModulesPlugin');

const PRODUCTION = process.env.NODE_ENV === 'production';
const HOT = process.env.BABEL_ENV === 'hot';
const SERVER = process.env.SERVER_RENDERING;
const EXTRACT_TEXT = PRODUCTION || SERVER;
const CSS_SELECTOR_NAME = EXTRACT_TEXT ? '[hash:base64:5]' : '[name]_[local]_[hash:hex:5]';
const OUTPUT_NAME = SERVER ? '[name].js' : (HOT ? '[name]-[hash].js' : '[name]-[chunkhash].js');
const PUBLIC_PATH = '/assets/';
const HOST = 'localhost';
const PORT = 8081;


function entry(path, server = false) {
  const entry = ['babel-polyfill', path];
  if (!server) {
    entry.unshift('./src/styles/global.scss');
  }
  return entry;
}

export function hotEntry(host = 'localhost', port = 8081, ...items) {
  if (HOT) {
    return [
      `webpack-dev-server/client?http://${host}:${port}`,
      'webpack/hot/only-dev-server',
        ...items
  ];
  }
  return items;
}

//noinspection JSUnresolvedFunction,JSUnresolvedVariable
const config = {
  context: path.resolve('.'),

  entry: SERVER ? {
    server: entry('./src/server', true)
  } : {
    client: hotEntry(HOST, PORT, ...entry('./src/client'))
},

output: {
  path: path.resolve('build'),
      filename: OUTPUT_NAME,
      publicPath: PUBLIC_PATH,
      libraryTarget: 'umd'
},

resolve: {
  modulesDirectories: ['web_modules', 'node_modules'],
      extensions: ['', '.js'],
      alias: {
    'react-redux': 'redux-simple'
  }
},

module: {
  noParse: [/sinon\.js/],
      preLoaders: PRODUCTION ? [] : [
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
      loader: EXTRACT_TEXT
          ? ExtractTextPlugin.extract('style', 'css?module&importLoaders=1&localIdentName=' + CSS_SELECTOR_NAME + '!postcss?pack=general!sass')
          : 'style!css?module&importLoaders=1&localIdentName=' + CSS_SELECTOR_NAME + '!postcss?pack=general!sass'
    },
    {
      test: /\/[a-z][^\/]*\.scss/,
      loader: EXTRACT_TEXT
          ? ExtractTextPlugin.extract('style', 'css!postcss?pack=general!sass')
          : 'style!css!postcss?pack=general!sass'
    },
    {
      test: /(\/src\/icons\/|\/src\/custom-icons\/|material-design-icons).+\.svg$/,
      loader: 'react-icon'
    },
    {
      test: /\.css$/,
      loader: EXTRACT_TEXT ? ExtractTextPlugin.extract('style', 'css') : 'style!css'
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
    autoprefixer({browsers: ['last 2 versions']})
  ]
},

plugins: [
  new webpack.DefinePlugin({
    'process.env.SERVER_RENDERING': JSON.stringify(process.env.SERVER_RENDERING || null),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }),
  new webpack.NoErrorsPlugin()
  //new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
]
};

if (SERVER) {
  config.target = 'node';
  config.plugins.push(
      new ExtractTextPlugin('[name]-[contenthash].css', {allChunks: true}),
      new IgnoreNodeModulesPlugin()
  );
} else {
  //noinspection JSUnresolvedFunction,JSUnresolvedVariable
  config.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: module => module.resource && module.resource.indexOf('node_modules') !== -1
}),
  new BundleTracker({filename: './webpack-stats.json'})
);

  if (PRODUCTION) {
    config.devtool = 'sourcemap';
    config.output.devtoolModuleFilenameTemplate = 'file://[resource-path]';
    config.output.devtoolFallbackModuleFilenameTemplate = 'file://[resource-path]?[hash]';
    config.recordsPath = path.resolve('webpack-records.json');
    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    config.plugins.push(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({comments: /a^/, compress: {warnings: false}}),
        new ExtractTextPlugin('[name]-[contenthash].css', {allChunks: true})
    );
  } else {
    config.devtool = 'eval-sourcemap';
    config.devServer = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
}

export default config;
