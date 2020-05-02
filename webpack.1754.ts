import * as HTMLWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { commonPlugins, devMode, faviconTags } from './webpack.config';

const htmlPlugins = (entry: { [chunk: string]: HTMLWebpackPlugin.Options }) => {
  const output: Array<HTMLWebpackPlugin> = [];
  for (const [chunk, options] of Object.entries(entry)) {
    output.push(
      new HTMLWebpackPlugin({
        inject: false,
        chunks: [chunk],
        minify: false,
        faviconTags,
        template: './src/1754/index.ejs',
        ...options,
      })
    );
  }
  return output;
};

export default function () {
  return {
    entry: {
      main: ['./src/1754/main/index.tsx', './src/1754/main/index.scss'],
      login: ['./src/1754/main/index.tsx', './src/1754/main/index.scss'],
      register: ['./src/1754/main/index.tsx', './src/1754/main/index.scss'],
      dashboard: ['./src/1754/main/index.tsx', './src/1754/main/index.scss'],
    },
    output: {
      filename: devMode ? '[name].js' : '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist/1754'),
      publicPath: '/1754',
    },
    plugins: [
      ...commonPlugins(),
      ...(devMode
        ? [new BundleAnalyzerPlugin({ openAnalyzer: false })]
        : [
            new BundleAnalyzerPlugin({
              openAnalyzer: false,
              analyzerMode: 'static',
              reportFilename: './views/analyze.html',
            }),
          ]),
      new webpack.DefinePlugin({
        'process.env.GRECAPTCHA_SITE_KEY': JSON.stringify(process.env.GRECAPTCHA_SITE_KEY),
      }),
      ...htmlPlugins({
        main: {
          title: 'Home',
          filename: './views/home.html',
        },
        login: {
          title: 'Login',
          filename: './views/login.html',
        },
        dashboard: {
          title: 'Dashboard',
          filename: './views/dashboard.html',
        },
        register: {
          title: 'Register',
          filename: './views/register.html',
          extraBodyTags:
            '<script src="https://www.google.com/recaptcha/api.js?onload=init&render=explicit" async defer></script>',
        },
      }),
    ],
  };
}
