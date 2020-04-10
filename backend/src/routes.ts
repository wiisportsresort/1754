import express from 'express';
import { resolve } from './common';

const file = (file: string) => (_req: express.Request, res: express.Response) => res.sendFile(resolve(file));

export default function (app: express.Express) {
  // icons, assets, etc
  app.use(express.static(resolve('public')));

  // app pages
  app.get('/', file('views/index.html'));
  app.get('/login', file('views/login.html'));

  // API
  app.post('/api/auth/login', (req, res) => {});
  app.post('/api/auth/refresh', (req, res) => {});


  app.post('/api/games/new', (req, res) => {});
  app.post('/api/games/delete', (req, res) => {});
  app.get('/api/games/verify/:code', (req, res) => {});
  app.get('/api/games/details/:code', (req, res) => {});

  return app;
}
