const { promisify } = require('util');
const fse = require('fs-extra');
const express = require('express');
const ch = require('chalk');
const socketio = require('socket.io');
const http = require('http'); // require('https');
const webpack = require('webpack');
const path = require('path');
const createRoutes = require('./routes');
const webpackConfig = require('../webpack.config.js');
const games = require('./game');
const auth = require('./auth');
const { logServe, logBuild, developmentEnabled } = require('./common');
require('dotenv').config();

/**
 * @typedef {object} keyStore - Holds values for password storage.
 * @property {Buffer} key
 * @property {Buffer} salt
 * @property {number} iterations
 */

// load and assign HTTPS certificate
// const key = 'privkey.pem',
//   cert = 'cert.pem',
//   ca = 'chain.pem';
// const credientials = {
//   key: fs.readFileSync(process.env.SSL_PATH + '/' + key, 'utf8'),
//   cert: fs.readFileSync(process.env.SSL_PATH + '/' + cert, 'utf8'),
//   ca: fs.readFileSync(process.env.SSL_PATH + '/' + ca, 'utf8')
// };

const app = createRoutes(express());
const server = http.createServer(app); // https.createServer(credentials, app);
const io = socketio(server);

// game synchronization
io.on('connection', (socket) => {
  socket.emit('_identify');
});

app.post('/api/authenticate/:type/:token', (req, res) => {
  switch (req.params.type) {
    case 'edit':
      break;
    case 'view':
      break;
  }
});

// webpack compilation (scss, es6 => es5)
(async () => {
  const webpackCompiler = webpack(webpackConfig);
  if (!developmentEnabled) {
    webpackCompiler.run((err, stat) => {
      if (err) logBuild(err);
      const comp = stat.compilation;

      logBuild(
        stat.toString({
          modules: false,
          colors: true,
          children: false,
          timings: true
        })
      );
      
      webpackCompiler.close();
    });

    app.use(express.static(path.resolve(__dirname, '../dist')));
  } else {
    // webpack middleware (build on update, live reload); development only
    const webpackDevMiddleware = require('webpack-dev-middleware');
    app.use(
      webpackDevMiddleware(webpackCompiler, {
        stats: {
          children: false,
          colors: true,
        },
        watchOptions: {
          aggregateTimeout: 300,
          ignored: ['public/**', 'node_modules/**'],
        },
      })
    );
  }
})();

// open server
const listener = server.listen(process.env.SERVER_PORT, () => {
  logServe(ch`{green Server opened on port ${process.env.SERVER_PORT}}`);
});
// graceful exit
process.on('SIGTERM', () => exit('SIGTERM'));
process.on('SIGUSR2', () => exit('SIGUSR2'));
process.on('SIGINT', () => exit('SIGINT'));
function exit(signal) {
  logServe(ch`{red ${signal} received.}`);
  logServe(ch`{yellow Closing HTTP server.}`);
  listener.close(() => {
    logServe(ch`{green HTTP server closed.}`);
    logServe('Exiting.');
    process.exit(0);
  });
}
