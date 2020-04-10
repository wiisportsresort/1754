import express from 'express';
import ch from 'chalk';
import socketio from 'socket.io';
import http from 'http';
import webpack from 'webpack';
import path from 'path';
import createRoutes from './routes';
import webpackConfig from '../webpack.config.js';
import * as games from './game';
import * as auth from './auth';
import { logServe, logBuild, devMode } from './common';
require('dotenv').config();

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
const server = http.createServer(app);
const io = socketio(server);

// game synchronization
io.on('connection', socket => {
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

if (!devMode) {
  const compiler = webpack(webpackConfig);
  compiler.run((err, stat) => {
    if (err) logBuild(err.toString());
    const comp = stat.compilation;

    logBuild(
      stat.toString({
        modules: false,
        colors: true,
        children: false,
        timings: true,
      })
    );
  });

  app.use(express.static(path.resolve(__dirname, '../dist')));
} else {
  const webpackCompiler = webpack(webpackConfig);
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

// open server
const listener = server.listen(process.env.SERVER_PORT, () => {
  logServe(ch`{green Server opened on port ${process.env.SERVER_PORT}}`);
});

process.stdin.resume(); // don't exit until we explicitly exit

// graceful exit
const exitSignals: Array<NodeJS.Signals> = ['SIGTERM', 'SIGUSR2', 'SIGINT'];
exitSignals.forEach(signal =>
  process.on(signal, (signal: string) => {
    logServe(ch`{red ${signal} received.}`);
    logServe(ch`{yellow Closing HTTP server.}`);
    listener.close(() => {
      logServe(ch`{green HTTP server closed.}`);
      logServe('Exiting.');
      process.exit(0);
    });
  })
);
