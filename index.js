const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const webpack = require('webpack');
const path = require('path');
const webpackConfig = require('./webpack.config.js');
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

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// game synchronization
io.on('connection', (socket) => {
  socket.emit('_identify')
});

// icons, assets, etc
app.use(express.static(path.resolve(__dirname, 'public')));

// routes

const route = (file) => (_req, res) => res.sendFile(path.resolve(__dirname + '/' + file));

app.get('/', route('views/index.html'));
app.get('/login', route('views/login.html'));

app.post('/api/authenticate/:type/:token', (req, res) => {
  switch (req.params.type) {
    case 'edit':
      break;
    case 'view':
      break;
  }
});

// webpack compilation (scss, es6 => es5)
const webpackCompiler = webpack(webpackConfig);
if (process.env.NODE_ENV === 'production') {
  webpackCompiler.run(() => {
    app.use(express.static(path.resolve(__dirname, 'dist')));
  });
} else {
  // webpack middleware (build on update, live reload); development only
  const webpackDevMiddleware = require('webpack-dev-middleware');

  // - webpack HMR only 
  // const webpackHotMiddleware = require('webpack-hot-middleware');
  app.use(
    webpackDevMiddleware(webpackCompiler, {
      stats: {
        children: false,
        colors: true,
      },
      watchOptions: {
        aggregateTimeout: 300,
        poll: true,
      },
    })
  );

  // - webpack HMR only 
  // app.use(
  //   webpackHotMiddleware(webpackCompiler, {
  //     log: console.log,
  //     reload: true,
  //   })
  // );
}

// open server
server.listen(process.env.SERVER_PORT, () => console.log('server started on port ' + process.env.SERVER_PORT));
