import * as ch from 'chalk';
import * as crypto from 'crypto';
import * as express from 'express';
import * as fse from 'fs-extra';
import * as inquirer from 'inquirer';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { promisify } from 'util';
import axios from 'axios';
import {
  JWTPayload,
  Keystore,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
  Gamestore,
  RegisterRequest,
} from './types';
import { mapToObject, objectToMap, resolvePath } from './common';
import { Store } from './store';

const SALT_LENGTH = 64,
  KEY_LENGTH = 64,
  ITERATIONS = 200000;

const JWT_SECRET = fse.readFileSync(resolvePath('data/private.key'));
const JWT_EXPIRY_SECONDS = 60 * 15; // 15 min

const pbkdf2Promise = promisify(crypto.pbkdf2);

/** Returns a `Keystore` object containing the salt, derived key, and iteration count from PBKDF2 */
export async function generateKey(password: crypto.BinaryLike): Promise<Keystore> {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = await pbkdf2Promise(password, salt, ITERATIONS, KEY_LENGTH, 'sha512');
  return { salt, key, iterations: ITERATIONS };
}

/** Compare a password to a `Keystore` using PBKDF2. Returns true if the
 * generated key and stored key are equal. */
export async function verifyPassword(password: crypto.BinaryLike, store: Keystore) {
  const key = await pbkdf2Promise(
    password,
    store.salt,
    store.iterations,
    store.key.byteLength,
    'sha512'
  );
  return key.equals(store.key);
}

export interface StoreOptions {
  /** Path to JSON file to store data in. */
  path: string;
  /** Whether to write to disk every time `store.set()` is called. */
  writeOnSet?: boolean;
}

interface HandlerParams {
  users: Store<Keystore>;
  games: Store<Gamestore>;
}

export function handleLogin({ users, games }: HandlerParams) {
  return async (req: express.Request, res: express.Response) => {
    try {
      const { id, secret, type }: LoginRequest = req.body;
      if (type === 'student') {
      } else {
        if (users.has(id)) {
          const keystore = users.get(id);
          if (!keystore) {
            res.json(<LoginResponse>{
              success: false,
              type: 'teacher',
              reason: 'Invalid username or password.',
            });
            return;
          }
          if (await verifyPassword(secret, keystore)) {
            // correct username and password; generate jwt now
            const payload: JWTPayload = { id, type };
            const token = jwt.sign(payload, JWT_SECRET, {
              algorithm: 'HS256',
              expiresIn: JWT_EXPIRY_SECONDS,
            });
            res.cookie('token', token);
            res.json(<LoginResponse>{
              success: true,
              type: 'teacher',
            });
            // res.redirect('/');
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };
  /*
  const { username, password, gameCode, type } = req.body;
      
  // const hashedPassword = getHashedPassword(password); // verify PBKDF2

  // const user = users.find(u => {
  //   return u.username === username && hashedPassword === u.password;
  // });

  // if (user) {
  // const authToken = generateAuthToken(); // make JWT

  // Store authentication token
  //   authTokensFile.authTokens[authToken] = user;
  //   writeJSONToFile(authTokensFile, authTokensFilePath);

  // Setting the auth token in cookies
  //   res.cookie('AuthToken', authToken);
  // }

  res.redirect('/');
  */
}

export function handleRefresh({ users }: HandlerParams) {
  return async (req: express.Request, res: express.Response) => {};
}

export function handleLogout({ users }: HandlerParams) {
  return async (req: express.Request, res: express.Response) => {};
}

export function handleRegister({ users }: HandlerParams) {
  return async (req: express.Request, res: express.Response) => {
    const { id, secret, recaptchaToken }: RegisterRequest = req.body;
    try {
      const recaptchaResponse = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          secret: process.env.GRECAPTCHA_SECRET,
          response: recaptchaToken,
          remoteIp: req.socket.remoteAddress,
        }
      );
      const data = JSON.parse(recaptchaResponse.data);
      console.error("Recaptcha verify done.");
      console.log(data);
    } catch (err) {
      console.error("Recaptcha verify error.");
      console.error(err);
    }

    if (users.has(id)) {
      res.json(<RegisterResponse>{
        success: false,
        reason: 'User is already registered.',
        code: 'ERR-ALREADY-REGISTERED',
      });
      return;
    }

    // wait for either the user to respond to the prompt or 60s to elapse
    const result: { allow: boolean; timedOut?: boolean } = await new Promise((resolve, reject) => {
      const prompt = inquirer.prompt({
        type: 'confirm',
        message: ch`{reset.yellow.bold ${req.ip} wants to register the account {reset.blue ${id}}, allow?}`,
        name: 'allow',
        prefix: '⚠️ ',
        default: false,
      });

      let closePrompt = () => {
        // @ts-ignore // i don't know why this is protected in @types/inquirer
        prompt.ui.close();
        console.log('');
        console.log(ch`{reset.red Timed out after 60s.}`);
        resolve({ allow: false, timedOut: true });
      };
      const timeout = setTimeout(closePrompt, 60000);

      prompt.then(result => {
        result = result as { allow: boolean };
        clearTimeout(timeout);
        // @ts-ignore
        resolve({ allow: result.allow });
        // closePrompt = () => {};
      });
    });

    if (result.allow) {
      console.log(ch`{green Register request allowed.}`);

      res.json(<RegisterResponse>{
        success: true,
        code: 'SUCCESS',
      });

      users.set(id, await generateKey(secret));
      return;
    } else if (result.timedOut) {
      console.log(ch`{red Register request denied.}`);

      res.json(<RegisterResponse>{
        success: false,
        reason: 'Server timed out.',
        code: 'ERR-TIMED-OUT',
      });
    } else {
      console.log(ch`{red Register request denied.}`);

      res.json(<RegisterResponse>{
        success: false,
        reason: 'Server denied request',
      });
    }
  };
}
