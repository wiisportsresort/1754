const { promisify } = require('util');
const ch = require('chalk');

const developmentEnabled = process.env.NODE_ENV === 'development';

module.exports = {
  developmentEnabled,
  /**
   * Promisify all the provided functions.
   * @requires `promisify` from module `'util'`
   * @param {...function} functions - functions to promisify
   * @returns {Array<function>} array of functions in same order provided.
   */
  promisifyAll(...functions) {
    const output = [];
    for (const func of functions) output.push(promisify(func));
    return output;
  },
  /**
   * Get the indices of each match of `regex` in `str`.
   * @param {RegExp} regex
   * @param {string} str
   * @returns {Array<number>}
   */
  getMatchIndices(regex, str) {
    const output = [];
    let match;
    regex = new RegExp(regex);
    while ((match = regex.exec(str))) output.push(match.index);
    return output;
  },
  /**
   * Changes the content of a string by removing a range of
   * characters and/or adding new characters.
   *
   * @param {string} str String to insert into.
   * @param {number} start Index at which to start changing the string.
   * @param {number} del An integer indicating the number of old chars to remove.
   * @param {string} substr The String that is spliced in.
   * @return {string} A new string with the spliced substring.
   */
  strInsert: (str, start, del, substr) => str.slice(0, start) + substr + str.slice(start + Math.abs(del)),
  /**
   * Log with `serve` prefix (chalk `green.dim`).
   * @param {string} msg 
   */
  logServe(msg) {
    logWithPrefix('green.dim', 'serve', msg)
  },
  /**
   * Log with `build` prefix(chalk `blue.dim`).
   * @param {string} msg 
   */
  logBuild(msg) {
    logWithPrefix('blue.dim', 'build', msg);
  },
};

// ｢｣
function logWithPrefix(style, prefix, msg) {
  let output = msg;
  output = ch`{reset.${style} ${prefix}} ` + output;
  for (const index in module.exports.getMatchIndices(/\n/g, output)) {
    output = module.exports.strInsert(output, module.exports.getMatchIndices(/\n/g, output)[index] + 1, 0, ch`{reset.${style} ${prefix}} `);
  }
  console.log(output);
}