const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
require('dotenv').config();

const developmentEnabled = process.env.NODE_ENV === 'development';

const envPlugins = developmentEnabled
  ? [
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
      }),
    ]
  : [new OptimizeCSSAssetsPlugin()];

const envOptimization = developmentEnabled
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
const webpackConfig = {
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
  devServer: {
    stats: {
      colors: true,
      children: false,
    },
  },
  devtool: developmentEnabled ? 'inline-source-map' : 'source-map',
  watchOptions: {
    ignored: ['public/**', 'node_modules/**'],
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
        'vendor_react-dom': {
          test: /[\\/]node_modules[\\/]react-dom[\\/]/,
          name: 'vendor_react-dom',
          chunks: 'all',
          priority: 5,
        },
        vendor_react: {
          test: /[\\/]node_modules[\\/]react[\\/]/,
          name: 'vendor_react',
          chunks: 'all',
          priority: 5,
        },
        vendor_jquery: {
          test: /[\\/]node_modules[\\/]jquery[\\/]/,
          name: 'vendor_jquery',
          chunks: 'all',
          priority: 5,
        },
        vendor_other: {
          test: /[\\/]node_modules[\\/](?!react|react-dom|jquery).*[\\/]/,
          name: 'vendor_other',
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

module.exports = { webpackConfig, developmentEnabled };
// module.exports = webpackConfig;
