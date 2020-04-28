import * as path from 'path';
import { promisify } from 'util';

/**
 * Changes the content of a string by removing a range of
 * characters and/or adding new characters.
 */
export function strInsert(str: string, start: number, del: number, substr: string) {
  return str.slice(0, start) + substr + str.slice(start + Math.abs(del));
}

/** Resolve a directory/file from the project root. */
export function resolve(dir: string) {
  return path.resolve(process.cwd(), dir);
}

/** Promisify all the provided functions.  */
export function promisifyAll(...functions: Array<Function>) {
  const output: Array<Function> = [];
  for (const func of functions) output.push(promisify(func));
  return output;
}

export function mapToObject(map: Map<string, any>) {
  const obj: object = Object.create(null);
  for (const [key, value] of map) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[key] = value;
  }
  return obj;
}

export function objectToMap(obj: object) {
  const map = new Map<string, any>();
  for (let [key, value] of Object.entries(obj)) {
    map.set(key, value);
  }
  return map;
}