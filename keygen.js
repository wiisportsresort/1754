const { promisify } = require('util');
const fse = require('fs-extra');
const path = require('path');
const ch = require('chalk');
require('dotenv').config();
const generateKeyPairPromise = promisify(require('crypto').generateKeyPair);

(async () => {
  console.log(ch`{yellow Generating keys...}`);
  try {
    const keys = await generateKeyPairPromise('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: process.env.KEY_PASSPHRASE,
      },
    });
    Object.freeze(keys);

    await Promise.all([
      fse.writeFile(path.resolve(__dirname, 'data/public.key'), keys.publicKey),
      fse.writeFile(path.resolve(__dirname, 'data/private.key'), keys.privateKey),
    ]);

    console.log(ch`{green Generated successfully.}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    console.log(ch`{red Generation unsuccessful.}`);
    process.exit(1);
  }
})();
