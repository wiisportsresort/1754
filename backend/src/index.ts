import express from 'express';
import ch from 'chalk';
import socketio from 'socket.io';
import http from 'http';
import path from 'path';
import createRoutes from './routes';
import * as games from './game';
import * as auth from './auth';
import dotenv from 'dotenv';
dotenv.config();

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
const io = socketio(server, { serveClient: false });

// game synchronization
const teachers = io.of('/teacher');
teachers.on('connection', socket => {
  socket.emit('_identify');
});

const students = io.of('/student');
students.on('connection', socket => {

});

// open server
const listener = server.listen(process.env.SERVER_PORT, () => {
  console.log(ch`{green Server opened on port ${process.env.SERVER_PORT}}`);
});

process.stdin.resume(); // don't exit until we explicitly exit

// graceful exit
const exitSignals: Array<NodeJS.Signals> = ['SIGTERM', 'SIGUSR2', 'SIGINT'];
exitSignals.forEach(signal =>
  process.on(signal, (signal: string) => {
    console.log(ch`{red ${signal} received.}`);
    console.log(ch`{yellow Closing HTTP server.}`);
    listener.close(() => {
      console.log(ch`{green HTTP server closed.}`);
      console.log('Exiting.');
      process.exit(0);
    });
  })
);
