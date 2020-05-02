import * as HTMLWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { commonPlugins, devMode, faviconTags } from './webpack.config';

const htmlPlugins = (templates: Array<string>) => {
  const output: Array<HTMLWebpackPlugin> = [];
  for (const file of templates) {
    output.push(
      new HTMLWebpackPlugin({
        inject: false,
        chunks: ['main'],
        minify: false,
        faviconTags,
        template: `./src/main/templates/${file}.ejs`,
        filename: `./views/${file}.html`,
      })
    );
  }
  return output;
};

const unitTemplates: Array<string> = [];
for (let i = 0; i < 12; i++) unitTemplates.push(`unit${i + 1}`);

export default function () {
  return {
    entry: { main: ['./src/main/index.ts', './src/main/index.scss'] },
    output: {
      filename: devMode ? '[name].js' : '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    plugins: [
      ...commonPlugins(),
      ...(!devMode
        ? [
            new BundleAnalyzerPlugin({
              openAnalyzer: false,
              analyzerMode: 'static',
              reportFilename: './views/analyze.html',
            }),
          ]
        : []),
      new webpack.DefinePlugin({
        'process.env.GRECAPTCHA_SITE_KEY': JSON.stringify(process.env.GRECAPTCHA_SITE_KEY),
      }),
      ...htmlPlugins(['home', 'homework', 'parents', 'writing-guide', ...unitTemplates]),
    ],
  };
}
