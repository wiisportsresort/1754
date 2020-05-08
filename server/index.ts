import * as ch from 'chalk';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as socketio from 'socket.io';
import { createRoutes, createServer } from './server';
import { createSockets } from './socket';
dotenv.config();

const app = createRoutes(express());
const server = createServer(app);
const io = createSockets(socketio(server, { serveClient: false }));

// open server
const port = process.env.SERVER_PORT;
if (port == undefined) {
  console.error(ch`{red Error: SERVER_PORT env variable was undefined.}`);
  process.exit(1);
}

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      ch`
Error: port {bold ${port}} is being used by another process. Kill that process and try again.

{dim Hint: type {reset kill $(lsof -t -i :${port} -s TCP:LISTEN)} or {reset fuser -k ${port}/tcp} to kill the process}
`);
    process.exit(1);
  }
});

const listener = server.listen(port, () => console.log(ch`{green Server opened on port ${port}}`));

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

process.stdin.resume(); // don't exit until we explicitly exit
