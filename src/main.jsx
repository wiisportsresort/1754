import React from 'react';
import ReactDOM from 'react-dom';
import snackbar from 'snackbar';
import { Hexes } from './components/Hexes.jsx';
import { Navbar } from './components/Navbar.jsx';
import './main.scss'; // socket.io client side

/* global io */ /** socket.io interface */
const socket = io();

/** do not use, update `hexes.reassignHex(n, owner)` instead */
const initialHexOwners = {};
/** A representation of a country/tribe. */
class Group {
  /**
   * @param {string} name - name of this group. Stick to lowercase letters.
   * @param {...number} initialHexes - numbers of the hexes this group starts with.
   */
  constructor(...initialHexes) {
    this.initalHexes = initialHexes;
    for (let i of initialHexes) this.initialHexOwners[i] = name;
  }
}

class GroupManager {
  constructor(groups) {
    this.initalHexOwners = [];
    for (const [key, value] of Object.values(groups)) this[key] = value;
  }
}

const groups = new GroupManager({
  france: new Group(1, 4, 13, 14, 15, 16, 25),
  britain: new Group(2, 3, 5, 6, 7, 8, 9),
  mohawk: new Group(11, 12, 17, 18),
  cherokee: new Group(10, 19, 20),
  shawnee: new Group(21, 22, 29, 30),
  miami: new Group(23, 24, 28, 31),
  ojibwe: new Group(26, 27, 32)
});

/** Object holding each group for ease of access. */
// const groups = {
//   france: new Group('france', 1, 4, 13, 14, 15, 16, 25),
//   britain: new Group('britain', 2, 3, 5, 6, 7, 8, 9),
//   mohawk: new Group('mohawk', 11, 12, 17, 18),
//   cherokee: new Group('cherokee', 10, 19, 20),
//   shawnee: new Group('shawnee', 21, 22, 29, 30),
//   miami: new Group('miami', 23, 24, 28, 31),
//   ojibwe: new Group('ojibwe', 26, 27, 32)
// };

const hexes = <Hexes initialOwners={initialHexOwners} />;

/** Draw all 32 hexes in the color set in `hexOwners`. */
function drawHexes() {
  ReactDOM.render(<Hexes />, document.querySelector('#hexes'));
}

function setHexColor() {
  document.getElementById();
}

function init(event) {
  if (window.innerWidth < 800) {
    snackbar.show('Your screen may be too small to properly display this website. Consider using a screen greater tha 800px wide.');
    // $('#container').css('display', 'none');
    // $('body').css('width', '0');
    // ReactDOM.render(<ScreenTooSmall />, document.querySelector('#error'));
    return;
  }

  ReactDOM.render(hexes, document.querySelector('#hexes'));
  ReactDOM.render(<Navbar />, document.querySelector('#navbar'));
}

function reset() {}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', () => (document.body.style.visibility = 'visible'));

console.log('hi');

// webpack hot module replacement
if (module.hot) {
  module.hot.accept();
  // module.hot.dispose(function() {
  //   window.location.reload();
  // });
}
