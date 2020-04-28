import * as crypto from 'crypto';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { EventEmitter } from 'events';
import { promisify } from 'util';
import { LoginData, JWTPayload, Keystore } from '../types';
import { objectToMap, mapToObject, resolve } from './common';

const SALT_LENGTH = 64,
  KEY_LENGTH = 64,
  ITERATIONS = 200000;

const JWT_SECRET = fse.readFileSync(resolve('data/private.key'));
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

export interface UserStoreOptions {
  /** Path to JSON file to store login data in. */
  path?: string;
  /** Whether to write to disk every time a login is set. */
  writeOnSet?: boolean;
}

export class UserStore {
  public events: EventEmitter;
  private map: Map<string, Keystore>;
  static defaultPath = path.resolve(__dirname, '../data/users.json');
  public path: string;

  constructor(options: UserStoreOptions = {}) {
    this.events = new EventEmitter();
    this.map = this.readFile();
    this.path = options.path ?? UserStore.defaultPath;
    if (options.writeOnSet) {
      this.events.addListener('set', () => {
        this.writeFile();
      });
    }
  }
  /** Read the contents of `userStore.path`
   * and interpret as `Map`; if it throws an error,
   * will return an empty map instead. */
  readFile() {
    try {
      const raw = (fse.readFileSync(this.path) as unknown) as string;
      const data: object = JSON.parse(raw);
      return objectToMap(data) as Map<string, Keystore>;
    } catch (err) {
      return new Map<string, Keystore>();
    }
  }
  /** Delete all users from the map.
   * Emits `clear` once writing is complete. */
  async clear() {
    this.map.clear();
    await this.writeFile();
    this.events.emit('clear');
  }
  /** Write the current contents to disk.
   * Emits `write` after complete. */
  async writeFile() {
    await fse.writeFile(UserStore.defaultPath, JSON.stringify(mapToObject(this.map), null, 2));
    this.events.emit('write');
  }
  /** Set the keystore for a given user.
   * Emits `set` after setting is complete. */
  set(user: string, keystore: Keystore) {
    this.map.set(user, keystore);
    this.events.emit('set');
  }
  /** Retrieve a keystore for a given user.
   * Emits `get`. */
  get(user: string) {
    this.events.emit('get');
    return this.map.get(user);
  }
  /** Returns an iterable of duples in the format [username, keystore]. */
  get entries() {
    return this.map.entries;
  }
  /** Returns an array of all usernames in the map. */
  get users() {
    return this.map.keys;
  }
  /** Check if user exists in the map. */
  has(user: string) {
    return this.map.has(user);
  }
}

const users = new UserStore({ writeOnSet: true });
const refreshTokens = new Map();

export function handleLogin() {
  return async (req: express.Request, res: express.Response) => {
    try {
      const { id, secret, type }: LoginData = req.body;
      if (type === 'student') {
      } else {
        if (users.has(id)) {
          const keystore = users.get(id);
          if (!keystore) return;
          if (await verifyPassword(secret, keystore)) {
            // correct username and password; generate jwt now
            const payload: JWTPayload = { id, type };
            const token = jwt.sign({ id }, JWT_SECRET, {
              algorithm: 'HS256',
              expiresIn: JWT_EXPIRY_SECONDS,
            });
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

export function handleRefresh() {
  return async (req: express.Request, res: express.Response) => {};
}
