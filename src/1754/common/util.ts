/** Captializes the first letter in the string. */
export const capitalize = (string: string) => string[0].toUpperCase() + string.slice(1);

export class EventPipe {
  listeners: {};

  constructor() {
    this.listeners = {};
  }

  on(type: string, callback: (event: CustomEvent) => any) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  cancel(type: string, callback: any) {
    if (!(type in this.listeners)) {
      return;
    }
    var stack = this.listeners[type];
    for (var i = 0, l = stack.length; i < l; i++) {
      if (stack[i] === callback) {
        stack.splice(i, 1);
        return;
      }
    }
  }

  dispatch(event: CustomEvent) {
    if (!(event.type in this.listeners)) {
      return true;
    }
    var stack = this.listeners[event.type].slice();
    for (var i = 0, l = stack.length; i < l; i++) {
      stack[i].call(this, event);
    }
    return !event.defaultPrevented;
  }
}
