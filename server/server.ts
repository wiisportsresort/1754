import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as fse from 'fs-extra';
import * as http from 'http';
import * as https from 'https';
import { handleLogin, handleLogout, handleRefresh, handleRegister } from './auth';
import { resolvePath } from './common';

const file = (file: string) => (_req: express.Request, res: express.Response) =>
  res.sendFile(resolvePath(file));

export function createRoutes(app: express.Express) {
  // make sure ip reading is allowed
  app.set('trust proxy', true);

  // gzip files
  app.use(compression());

  // setup auth
  app.use(bodyParser.json());
  app.use(cookieParser());

  // icons, assets, etc
  app.use(express.static(resolvePath('public')));
  app.use(express.static(resolvePath('dist')));

  // routes
  // main
  app.get('/', file('dist/views/home.html'))
  app.get('/parents', file('dist/views/parents.html'))
  app.get('/homework', file('dist/views/homework.html'))
  app.get('/writing-guide', file('dist/views/writing-guide.html'))
  for (let i = 0; i < 12; i++) app.get(`/unit${i + 1}`, file(`dist/views/unit${i + 1}`));

  // 1754
  app.get('/1754', file('dist/1754/views/home.html'));
  app.get('/1754/login', file('dist/1754/views/login.html'));
  app.get('/1754/register', file('dist/1754/views/register.html'));
  app.get('/1754/dashboard', file('dist/1754/views/dashboard.html'));

  // API
  app.post('/1754/api/auth/login', handleLogin());
  app.post('/1754/api/auth/refresh', handleRefresh());
  app.post('/1754/api/auth/logout', handleLogout());
  app.post('/1754/api/auth/register', handleRegister());

  app.post('/1754/api/games/new', (req, res) => {});
  app.post('/1754/api/games/delete', (req, res) => {});
  app.get('/1754/api/games/verify/:code', (req, res) => {});
  app.get('/1754/api/games/details/:code', (req, res) => {});

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
