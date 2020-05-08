import * as HTMLWebpackPlugin from 'html-webpack-plugin';
import * as ScriptExtHTMLWebpackPlugin from 'script-ext-html-webpack-plugin';

import * as path from 'path';
import * as webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { commonPlugins, devMode, faviconTags } from './webpack.config';

const htmlPlugins = (entry: {
  [chunk: string]: HTMLWebpackPlugin.Options & {
    /** Content to place before HTMLWebpackPlugin inserted body tags. */
    preBody?: string;
    /** Content to place after HTMLWebpackPlugin inserted body tags. */
    postBody?: string;
    /** Content to place before HTMLWebpackPlugin inserted head tags. */
    preHead?: string;
    /** Content to place after HTMLWebpackPlugin inserted head tags. */
    postHead?: string;
  };
}) => {
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

export default function (): webpack.Configuration {
  const src = (entrypoints: string) => {
    const folders = entrypoints.split(' ');
    const output: { [name: string]: string } = {};
    for (const folder of folders) {
      output[folder] = `./src/1754/${folder}/index.tsx`;
    }
    return output;
  };
  return {
    entry: src('main login register dashboard async-test'),
    // {
    //   main: ['./src/1754/main/index.tsx', './src/1754/main/index.scss'],
    //   login: ['./src/1754/login/index.tsx', './src/1754/login/index.scss'],
    //   register: ['./src/1754/register/index.tsx', './src/1754/register/index.scss'],
    //   dashboard: ['./src/1754/dashboard/index.tsx', './src/1754/dashboard/index.scss'],
    // },
    output: {
      path: path.resolve(__dirname, 'dist/1754'),
      publicPath: '/1754/',
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
          postBody:
            '<script src="https://www.google.com/recaptcha/api.js?onload=init&render=explicit" async defer></script>',
        },
        'async-test': {
          title: 'Async Test',
          filename: './views/async-test.html',
        },
      }),
      new ScriptExtHTMLWebpackPlugin({
        sync: /runtime(\..+)?\.js/,
        async: /vendor(-react|-jquery|s)?(\..+)?\.js/,
        defaultAttribute: 'defer',
      }),
    ],
  };
}
