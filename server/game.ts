import * as fse from 'fs-extra';
import * as path from 'path';

const GAME_STORE_PATH = path.resolve(__dirname, '../data/games.json');

/** Reset the games file to `{ users: {} }`. */
export async function clearFile() {
  await fse.writeFile(GAME_STORE_PATH, JSON.stringify({ users: {} }, null, 2));
}
