const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
require('dotenv').config();

const developmentEnabled = process.env.NODE_ENV === 'development';

module.exports = {
  mode: developmentEnabled ? 'development' : 'production',
  entry: {
    main: developmentEnabled ? ['webpack-hot-middleware/client?overlay=true', './src/main.js'] : './src/main.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  context: __dirname,
  stats: { children: false },
  devtool: developmentEnabled ? 'inline-source-map' : 'source-map',
  watchOptions: {
    ignored: ['public/**', 'node_modules/**'],
    aggregateTimeout: 0
  },
  plugins: [
    ...(developmentEnabled
      ? [new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()]
      : []),
    new BundleAnalyzerPlugin({
      openAnalyzer: false
    }),
    new MiniCSSExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  externals: {
    jquery: '$',
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [
      {
        test: /\.(jp(e?)g|png|gif|mp3|ttf|eot|woff)$/i,
        loader: 'file-loader'
      },
      {
        test: /\.scss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer()]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.js(x?)$/,
        use: [
          'source-map-loader',
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        ]
      }
    ]
  }
};
