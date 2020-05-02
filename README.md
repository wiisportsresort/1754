# 1754

![Node.js Build](https://github.com/wiisportsresort/1754/workflows/Node.js%20Build/badge.svg?branch=master)

a game

## environment

see `.env.example` for more information on environment variables

## Summary

The idea is to have three different versions of the website.
1. teacher version - can control the board
2. student version - can watch the board change
3. offline version - no connectivity

There will be game codes associated with each game that the teacher should be able to create from their endpoint.

*Note: `JWT` = JSON Web Token (<https://jwt.io>)*

### Planned routes

- `/`: offline version
- `/teacher`: teacher version
- `/student`: student version
- `/login`: login page => teacher/student endpoint
- `/api/`: data operations
  - `auth/`: authentication
    - `refresh`: refresh a JWT (a JWT should not have a lifetime greater than a few hours)
    - `login`: login as teacher/student and generate a JWT
    - `logout`: logout
  - `games/`: game state management
    - `new`: create new game and game code (accessible only as teacher)
    - `delete`: delete existing game  (accessible only as teacher)
    - `verify/:code`: check code validity
    - `details/:code`: get details about the game
    - `get/:code`: fetch game state

