import * as path from 'path';
import * as autoprefixer from 'autoprefixer';
import * as MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import * as webpack from 'webpack';
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import * as TerserPlugin from 'terser-webpack-plugin';

require('dotenv').config();

const devMode = process.env.NODE_ENV === 'development';

console.log(`Mode: ${devMode ? 'development' : 'production'}`);

const envPlugins = devMode
  ? [
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
      }),
    ]
  : [new OptimizeCSSAssetsPlugin()];

const envOptimization = devMode
  ? {
      minimize: false,
      minimizer: undefined,
    }
  : {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          test: /\.js(x?)$/i,
          sourceMap: true,
          extractComments: true,
        }),
      ],
    };

export default <webpack.Configuration>{
  mode: devMode ? 'development' : 'production',
  entry: {
    main: './src/main',
    login: './src/login',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  stats: {
    children: false,
    source: false,
    colors: true,
  },
  devtool: devMode ? 'inline-source-map' : 'source-map',
  watchOptions: {
    ignored: ['../public/**', '../node_modules/**'],
    aggregateTimeout: 0,
  },
  plugins: [
    ...envPlugins,
    new MiniCSSExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    ...envOptimization,
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      // minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendor_react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor-react',
          chunks: 'all',
          priority: 5,
        },
        vendor_jquery: {
          test: /[\\/]node_modules[\\/]jquery[\\/]/,
          name: 'vendor-jquery',
          chunks: 'all',
          priority: 5,
        },
        vendor_other: {
          test: /[\\/]node_modules[\\/](?!react|react-dom|jquery).*[\\/]/,
          name: 'vendor-other',
          chunks: 'all',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
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
          MiniCSSExtractPlugin.loader,
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
