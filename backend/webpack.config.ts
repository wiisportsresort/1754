import path from 'path';
import * as webpack from 'webpack';
import * as dotenv from 'dotenv';
dotenv.config();

const devMode = process.env.NODE_ENV === 'development';

export default <webpack.Configuration>{
  mode: devMode ? 'development' : 'production',
  entry: './src',
  target: 'node',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
  devServer: {
    stats: {
      colors: true,
      children: false,
    },
  },
  devtool: devMode ? 'inline-source-map' : 'source-map',
  watchOptions: {
    ignored: ['../node_modules/**'],
    aggregateTimeout: 0,
  },
  plugins: [
    
    
  ],
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        enforce: 'pre',
        loader: 'source-map-loader',
      },
      {
        test: /\.ts(x?)/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
    ],
  },
};
