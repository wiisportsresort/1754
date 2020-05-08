import { EventEmitter } from 'events';
import * as fse from 'fs-extra';
import { resolvePath, objectToMap, mapToObject } from "./common";
import { StoreOptions } from "./auth";

export class Store<T> {
  public events: EventEmitter;
  private map: Map<string, T>;
  public path: string;

  constructor(options: StoreOptions) {
    this.events = new EventEmitter();
    this.map = this.readFile();
    this.path = options.path;
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
      return objectToMap(data) as Map<string, T>;
    } catch (err) {
      return new Map<string, T>();
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
    await fse.writeFile(this.path, JSON.stringify(mapToObject(this.map)));
    this.events.emit('write');
  }
  /** Set the keystore for a given user.
   * Emits `set` after setting is complete. */
  set(user: string, keystore: T) {
    this.map.set(user, keystore);
    this.events.emit('set');
  }
  /** Retrieve a keystore for a given user.
   * Emits `get`. */
  get(id: string) {
    this.events.emit('get');
    return this.map.get(id);
  }
  /** Returns an iterable of duples in the format [username, keystore]. */
  get entries() {
    return this.map.entries;
  }
  /** Returns an array of all usernames in the map. */
  get ids() {
    return this.map.keys;
  }
  /** Check if user exists in the map. */
  has(id: string) {
    return this.map.has(id);
  }
}