# Information

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
  - `games/`: game state management (accessible only as teacher, JWT must be attached)
    - `new`: create new game and game code
    - `delete`: delete existing game
    - `verify/:code`: check code validity
    - `details/:code`: get details about the game

###  Schemas

#### JWT Payload
```jsonc
{
  // type - string
  // must be "teacher" or "student"
  "type": "student", ✅
  "type": "foo", ❌ // 400 Bad Request

  // type - string
  // teacher - must match account username
  // student - freeform identifier
  // regex - /[a-z][a-z0-9_\-\.]+[a-z0-9]+/gi
  "username": "foo.bar15",  ✅
  "username": ".abcde_", ❌ // 400 Bad Request

  // type - string
  // teacher - must match account password
  // student - must not be provided (400)
  // regex - /.{8}.*/g
  "password": "1_3=5-7.", ✅
  "password": "1_3_5", ❌ // 400 Bad Request

  // type - string
  // teacher - must not be provided (400)
  // student - must match a valid game code
  // regex - /[a-z]{5}/gi
  "gameCode": "xbfqe", ✅
  "gameCode": "thisisagamecode" ❌ // 400 Bad Request


}
```

## Todo List

### Client 

- Context menu
- Login page
- Teacher page
- Student page
- Token refreshing

### Server

- Authentication API
  - JWT generation and verification
- socket.io communication and events
