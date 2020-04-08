const path = require('path');
const express = require('express');
const file = (file) => (_req, res) => res.sendFile(path.resolve(__dirname + '/../' + file));

module.exports = function(app) {
  // icons, assets, etc
  app.use(express.static(path.resolve(__dirname, '../public')));

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

/* - `/api/`: data operations
  - `auth/`: authentication
    - `refresh`: refresh a JWT (a JWT should not have a lifetime greater than a few hours)
    - `login`: login as teacher/student and generate a JWT
  - `games/`: game state management (accessible only as teacher, JWT must be attached)
    - `new`: create new game and game code
    - `delete`: delete existing game
    */
