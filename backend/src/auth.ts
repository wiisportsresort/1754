import crypto from 'crypto';
import fse from 'fs-extra';
import path from 'path';
import { promisify } from 'util';

const SALT_LENGTH = 64,
  KEY_LENGTH = 64,
  ITERATIONS = 200000,
  USER_STORE_PATH = path.resolve(__dirname, '../data/users.json');

const pbkdf2Promise = promisify(crypto.pbkdf2);

/**
 * @typedef {object} keyStore - Holds values for password storage.
 * @property {Buffer} key
 * @property {Buffer} salt
 * @property {number} iterations
 */

module.exports = {
  /** Reset the users file to `{ users: {} }`. */
  async clearFile() {
    await fse.writeFile(USER_STORE_PATH, JSON.stringify({ users: {} }, null, 2));
  },

  /**
   * Create a derived key using PBKDF2.
   * @param {string} password - string to generate a key for
   * @returns {keyStore} `{ key, salt, iterations }`
   */
  async generate(password) {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = await pbkdf2Promise(password, salt, ITERATIONS, KEY_LENGTH, 'sha512');
    return { salt, key, iterations: ITERATIONS };
  },

  /**
   * Verify an attempt to authenticate.
   * @param {string} password - passsword to verify
   * @param {keyStore} store - stored `{ key, salt, iterations }` to verify against
   */
  async verify(password, store) {
    const key = await pbkdf2Promise(password, store.salt, store.iterations, store.key.byteLength, 'sha512');
    return key.equals(store.key);
  },

  storeUser() {
    
  }
};
