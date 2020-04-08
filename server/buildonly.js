const webpack = require('webpack');
const { webpackConfig } = require('../webpack.config.js');

const webpackCompiler = webpack(webpackConfig);
webpackCompiler.run((err, stat) => {
  console.log('Config: ')
  console.log(webpackConfig)
  if (err) {
    console.error(err);
    // webpackCompiler.close(); // webpack 5 only
    console.log('Build completed with error.');
    process.exit(1);
  }

  console.log(stat.toString({ colors: true }));
  // webpackCompiler.close(); // webpack 5 only
  console.log('Build completed.');
  process.exit(0);
});
