import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import snackbar from 'snackbar';
import { Hexes } from './components/Hexes';
import { Navbar } from './components/Navbar';
import { EventPipe } from '../common/event';
import { defaultOwners } from '../common/hexData';
import './index.scss';

// socket.io client side
/* global io */ 
const socket = io();
/** A representation of a country/tribe. */
class Group {
  /**
   * @param {string} name - name of this group. Stick to lowercase letters.
   * @param {...number} initialHexes - numbers of the hexes this group starts with.
   */
  constructor(...initialHexes) {
    this.initialHexes = initialHexes;
  }
}

class BoardManager extends EventPipe {
  /**
   * Create a new board, with the hexes, navbar, and event handler.
   * @param {Object.<string, (Array<number>|Group)>} groups groups with their initial owned hexes; can be either an object with arrays of numbers or the instances of `Group`, arrays will be converted to instances if provided.
   */
  constructor(groups) {
    super();

    // set default groups if not provided, change into group instances
    groups = groups || defaultOwners;
    if (Array.isArray(groups[Object.keys(groups)[0]])) {
      for (const [name, array] of Object.entries(groups)) {
        groups[name] = new Group(...array);
      }
    }
    

    /** initial owners only, update eventPipe instead */
    this.initialHexOwners = {};
    this.initialOwnedHexes = {};

    for (const [name, group] of Object.entries(groups)) {
      this.initialOwnedHexes[name] = group.initialHexes;
      for (const hex of group.initialHexes) {
        this.initialHexOwners[hex] = name;
      }
    }

    this.hexes = <Hexes initialOwners={this.initialHexOwners} eventPipe={this} />;
    this.navbar = <Navbar initialOwnedHexes={this.initialOwnedHexes} eventPipe={this} />;

    this.on('reset', reset);
    return this;
  }
  /** Draw all 32 hexes into the provided element. */
  drawHexes(selector) {
    ReactDOM.render(this.hexes, document.querySelector(selector));
    return this;
  }
  /** Draw the button navbar into the provided element. */
  drawNavbar(selector) {
    ReactDOM.render(this.navbar, document.querySelector(selector));
    return this;
  }
}

const game = new BoardManager();

function init(_event) {
  if (window.innerWidth < 800) {
    snackbar.show('Your screen may be too small to properly display this website. Consider using a screen greater than 800px in width.');
    // $('#container').css('display', 'none');
    // $('body').css('width', '0');
    // ReactDOM.render(<ScreenTooSmall />, document.querySelector('#error'));
    // return;
  }

  game.drawHexes('#hexes').drawNavbar('#navbar');

  console.log('init() finished')
}

function reset() {}

window.addEventListener('DOMContentLoaded', init); 
window.addEventListener('load', () => (document.body.style.visibility = 'visible'));

$('#header-button-login').click(() => {
  window.location.href = './login';
})


// webpack hot module replacement
if (module.hot) { 
  module.hot.accept();
  // module.hot.accept(window.location.reload.bind(window.location));
  // window.location.reload();
  // module.hot.dispose(window.location.reload.bind(window.location));
}
