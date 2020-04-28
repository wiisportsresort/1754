import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as fse from 'fs-extra';
import * as http from 'http';
import * as https from 'https';
import { inspect } from 'util';
import { handleLogin, handleRefresh } from './auth';
import { resolve } from './common';

const file = (file: string) => (_req: express.Request, res: express.Response) =>
  res.sendFile(resolve(file));

export function createRoutes(app: express.Express) {
  // setup auth
  app.use(bodyParser.json());
  app.use(cookieParser());

  // icons, assets, etc
  app.use(express.static(resolve('public')));
  app.use(express.static(resolve('dist')));

  // app pages
  app.get('/', file('views/index.html'));
  app.get('/login', file('views/login.html'));

  // API
  app.post('/api/auth/login', handleLogin());
  app.post('/api/auth/refresh', handleRefresh());

  app.post('/api/games/new', (req, res) => {});
  app.post('/api/games/delete', (req, res) => {});
  app.get('/api/games/verify/:code', (req, res) => {});
  app.get('/api/games/details/:code', (req, res) => {});

  return app;
}

export function createServer(app: express.Express): https.Server | http.Server {
  type ExpressCast = (req: any, res: any) => void;
  const { ENABLE_SSL, SSL_CA, SSL_CERT, SSL_KEY } = process.env;
  if (ENABLE_SSL == 'true') {
    if (SSL_CA && SSL_CERT && SSL_KEY)
      return https.createServer(
        {
          ca: fse.readFileSync(SSL_CA),
          cert: fse.readFileSync(SSL_CERT),
          key: fse.readFileSync(SSL_KEY),
        },
        app as ExpressCast
      );
    // path for ca/cert/key not provided
    else
      throw new Error(
        'Server creation error: ENABLE_SSL was true but one or more of SSL_CA, SSL_CERT, and SSL_KEY was not specified.'
      );
  } else return http.createServer(app as ExpressCast);
}
