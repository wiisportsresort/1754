import { EventObject } from './util';
import { defaultOwnersToHexes } from './hexdata';
import { GroupName } from './types';

/** A representation of a country/tribe. */
export class Group {
  initialOwned: number[];
  /**
   * @param {...number} initialHexes - numbers of the hexes this group starts with.
   */
  constructor(...initialHexes: number[]) {
    this.initialOwned = initialHexes;
  }
}

export class Game extends EventObject {
  hexesToOwners: {};
  ownersToHexes: {};
  /**
   * Create a new board with hexes, navbar, and event handler.
   * @param groups groups with their initial owned hexes; can be either an object with arrays of numbers or the instances of `Group`, arrays will be converted to instances if provided.
   */
  constructor(groups: Array<Group> | {
    [owner in GroupName]: number[];
  } = defaultOwnersToHexes) {
    super();
    this.hexesToOwners = {};
    this.ownersToHexes = {};
    // change into group instances
    if (Array.isArray(groups[Object.keys(groups)[0]])) {
      for (const [name, array] of Object.entries(groups)) {
        groups[name] = new Group(...array);
      }
    }
    for (const [name, group] of Object.entries(groups) as Array<[string, Group]>) {
      this.ownersToHexes[name] = group.initialOwned;
      for (const hex of group.initialOwned) {
        this.hexesToOwners[hex] = name;
      }
    }
    this.on('reset', event => {
      this.ownersToHexes = defaultOwnersToHexes;
      for (const group of Object.keys(defaultOwnersToHexes)) {
        for (const hex of defaultOwnersToHexes[group]) {
          this.hexesToOwners[hex] = group;
        }
      }
      this.dispatch(new CustomEvent('navbarreset'));
      this.dispatch(new CustomEvent('hexesreset'));
    });
    return this;
  }
}

