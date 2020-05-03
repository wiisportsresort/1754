import * as autoprefixer from 'autoprefixer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import * as dotenv from 'dotenv';
import * as MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import * as path from 'path';
import * as _ from 'lodash/fp';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as webpack from 'webpack';
import config1754 from './webpack.1754';
import configMain from './webpack.main';

dotenv.config();

export const devMode = process.env.NODE_ENV === 'development';

export const faviconTags = `
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
  <meta name="msapplication-TileColor" content="#da532c" />
  <meta name="theme-color" content="#ffffff" />
`;

export function commonPlugins() {
  const output: Array<any> = [
    new MiniCSSExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: devMode ? '[name].css' : '[name].[contenthash].css',
      esModule: true,
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
  ];

  if (devMode) {
  } else output.push(new OptimizeCSSAssetsPlugin());

  return output;
}

export function commonOptimization() {
  if (devMode) {
    return {
      minimize: false,
      minimizer: undefined,
    };
  } else {
    return {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          test: /\.(j|t)s(x?)$/i,
          sourceMap: true,
          extractComments: false,
        }),
      ],
    };
  }
}

export const commonConfiguration = <webpack.Configuration>{
  mode: devMode ? 'development' : 'production',
  output: {
    filename: devMode ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: devMode ? '[name].js' : '[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  // stats: 'normal',
  stats: devMode
    ? {
        all: false,
        colors: true,
        hash: true,
        builtAt: true,
        timings: true,
        errors: true,
        errorDetails: true,
        logging: 'info',
        warnings: true,
        version: true,
        context: path.resolve(__dirname, 'src')
      }
    : 'normal',
  devtool: devMode ? 'eval-source-map' : 'source-map',
  watchOptions: {
    ignored: ['../public/**', '../node_modules/**'],
    aggregateTimeout: 0,
  },
  optimization: {
    ...commonOptimization(),
    runtimeChunk: 'single',
    // moduleIds: 'named',
    // namedChunks: true,
    // chunkIds: 'named',
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      // minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      name: false,
      cacheGroups: {
        'vendor-react': {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor-react',
          chunks: 'all',
          priority: 10,
          enforce: true,
        },
        'vendor-jquery': {
          test: /[\\/]node_modules[\\/]jquery[\\/]/,
          name: 'vendor-jquery',
          chunks: 'all',
          priority: 10,
          enforce: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 5,
          enforce: true,
        },
        default: {
          minChunks: 2,
          priority: 0,
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

export default function () {
  return <webpack.Configuration[]>[
    _.merge(commonConfiguration, configMain()),
    _.merge(commonConfiguration, config1754()),
  ];
}
