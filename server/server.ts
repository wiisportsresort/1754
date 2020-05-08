import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as fse from 'fs-extra';
import * as http from 'http';
import * as https from 'https';
import { handleLogin, handleLogout, handleRefresh, handleRegister } from './auth';
import { resolvePath } from './common';
import { Store } from './store';
import { Keystore, Gamestore } from './types';

const file = (file: string) => (_req: express.Request, res: express.Response) =>
  res.sendFile(resolvePath(file));

const users = new Store<Keystore>({
  path: resolvePath('data/users.json'),
  writeOnSet: true,
});

const games = new Store<Gamestore>({
  path: resolvePath('data/games.json'),
  writeOnSet: true,
});

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
  app
    .get('/', file('dist/views/home.html'))
    .get('/parents', file('dist/views/parents.html'))
    .get('/homework', file('dist/views/homework.html'))
    .get('/writing-guide', file('dist/views/writing-guide.html'));
  for (let i = 0; i < 12; i++) app.get(`/unit${i + 1}`, file(`dist/views/unit${i + 1}`));

  app
    // 1754
    .get('/1754', file('dist/1754/views/home.html'))
    .get('/1754/login', file('dist/1754/views/login.html'))
    .get('/1754/register', file('dist/1754/views/register.html'))
    .get('/1754/dashboard', file('dist/1754/views/dashboard.html'))
    .get('/1754/async-test', file('dist/1754/views/async-test.html'))

    // api
    // auth
    .post('/1754/api/auth/login', handleLogin({ users, games }))
    .post('/1754/api/auth/refresh', handleRefresh({ users, games }))
    .post('/1754/api/auth/logout', handleLogout({ users, games }))
    .post('/1754/api/auth/register', handleRegister({ users, games }))

    // games
    .post('/1754/api/games/new', (req, res) => {})
    .post('/1754/api/games/delete', (req, res) => {})
    .get('/1754/api/games/verify/:code', (req, res) => {})
    .get('/1754/api/games/details/:code', (req, res) => {});

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
