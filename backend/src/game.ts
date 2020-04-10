import fse from 'fs-extra';
import path from 'path';

const GAME_STORE_PATH = path.resolve(__dirname, '../data/games.json');

export async function clearFile() {
  await fse.writeFile(GAME_STORE_PATH, JSON.stringify({ users: {} }, null, 2));
}
