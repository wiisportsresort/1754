/** Captializes the first letter in the string. */
export const capitalize = (string: string) => string[0].toUpperCase() + string.slice(1);

/** Passes all elements of the array into `ReactDOM.unmountComponentAtNode`. */
export async function unmountAll(arr: Array<Element | null>) {
  for (const el of arr) {
    if (!el) return;
    (await import('react-dom')).unmountComponentAtNode(el);
  }
}

/** Event handling and dispatching.  */
export class EventObject {
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
    const stack = this.listeners[type];
    for (let i = 0, l = stack.length; i < l; i++) {
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
    const stack = this.listeners[event.type].slice();
    for (let i = 0, l = stack.length; i < l; i++) {
      stack[i].call(this, event);
    }
    return !event.defaultPrevented;
  }
}

export async function startApp(appComponent: JSX.Element, init?: () => any) {
  async function start() {
    (await import('react-dom')).render(appComponent, document.querySelector('#app'));
    if (init) init();
  }
  if (document.readyState !== 'loading') start();
  else window.addEventListener('DOMContentLoaded', start);
}