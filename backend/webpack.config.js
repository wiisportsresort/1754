const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

require('dotenv').config();

const devMode = process.env.NODE_ENV === 'development';

console.log(`Mode: ${devMode ? 'development' : 'production'}`);

/** @type {webpack.Configuration} */
module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: './backend/src',
  target: 'node',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devtool: devMode ? 'inline-source-map' : 'source-map',
  watchOptions: {
    ignored: ['../node_modules/**'],
    aggregateTimeout: 0,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        enforce: 'pre',
        loader: 'source-map-loader',
      },
      {
        test: /\.ts(x?)/,
        loader: 'ts-loader',
      },
    ],
  },
};
