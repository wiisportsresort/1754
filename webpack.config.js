const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
require('dotenv').config();

const developmentEnabled = process.env.NODE_ENV === 'development';

const devPlugins = developmentEnabled
  ? [
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
      }),
      new MiniCSSExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      // - webpack HMR only
      // new webpack.HotModuleReplacementPlugin(),
      // new webpack.NoEmitOnErrorsPlugin(),
    ]
  : [];

// - webpack HMR only
// const entry = entryFile => developmentEnabled ? ['webpack-hot-middleware/client?overlay=true', entryFile] : entryFile

module.exports = {
  mode: developmentEnabled ? 'development' : 'production',
  entry: {
    main: './src/main',
    login: './src/login',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  context: __dirname,
  stats: { children: false },
  devtool: developmentEnabled ? 'inline-source-map' : 'source-map',
  watchOptions: {
    ignored: ['public/**', 'node_modules/**'],
    aggregateTimeout: 0,
  },
  plugins: [...devPlugins],
  externals: {
    jquery: '$',
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [
      {
        test: /\.(jp(e?)g|png|gif|mp3|ttf|eot|woff)$/i,
        loader: 'file-loader',
      },
      {
        test: /\.scss$/,
        use: [
          developmentEnabled ? MiniCSSExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer()],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.js(x?)$/,
        use: [
          'source-map-loader',
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
    ],
  },
};
