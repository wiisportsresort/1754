import { promisify } from 'util';
import ch from 'chalk';
import path from 'path';

/**
 * Changes the content of a string by removing a range of
 * characters and/or adding new characters.
 */
function strInsert(str: string, start: number, del: number, substr: string) {
  return str.slice(0, start) + substr + str.slice(start + Math.abs(del));
};

/** Resolve a directory/file from the project root. */
export function resolve(dir: string) {
  return path.resolve(__dirname, '/../', dir);
}
/** Promisify all the provided functions.  */
export function promisifyAll(...functions: Array<Function>) {
  const output: Array<Function> = [];
  for (const func of functions) output.push(promisify(func));
  return output;
}

export function logServe(msg: Array<string> | string) {
  if (Array.isArray(msg)) msg.forEach(msg => logWithPrefix('green.dim', 'serve', msg));
  else logWithPrefix('green.dim', 'serve', msg);
}

export function logBuild(msg: Array<string> | string) {
  if (Array.isArray(msg)) msg.forEach(msg => logWithPrefix('blue.dim', 'build', msg));
  else logWithPrefix('green.dim', 'serve', msg);
}


function logWithPrefix(style: string, prefix: string, msg: string) {
  function getNewlines(str: string) {
    const output: Array<number> = [];
    const regex = new RegExp(/\n/g);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(str))) output.push(match.index);
    return output;
  }

  let out = msg;
  out = ch`{reset.${style} ${prefix}} ` + out;
  for (const i in getNewlines(out)) {
    out = strInsert(out, getNewlines(out)[i] + 1, 0, ch`{reset.${style} ${prefix}} `);
  }
  console.log(out);
}

// ｢｣
