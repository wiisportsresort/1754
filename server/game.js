const fse = require('fs-extra');
const path = require('path');

const GAME_STORE_PATH = path.resolve(__dirname, '../data/games.json');

module.exports = {
  async clearFile() {
    await fse.writeFile(GAME_STORE_PATH, JSON.stringify({ users: {} }, null, 2));
  },
};
