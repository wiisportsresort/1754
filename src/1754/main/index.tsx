import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import snackbar from 'snackbar';
import { Hexes } from './components/hexes';
import { Navbar } from './components/navbar';
import { EventPipe } from '../common/util';
import { defaultOwnersToHexes } from '../common/hexdata';
import { Header, Spacer } from '../common/components/header';
import { Button } from '../common/components/button';
import { GroupName } from '../common/props';

/** A representation of a country/tribe. */
class Group {
  initialHexes: number[];
  /**
   * @param {...number} initialHexes - numbers of the hexes this group starts with.
   */
  constructor(...initialHexes: number[]) {
    this.initialHexes = initialHexes;
  }
}

export class Game extends EventPipe {
  hexesToOwners: {};
  ownersToHexes: {};
 
  /**
   * Create a new board with hexes, navbar, and event handler.
   * @param groups groups with their initial owned hexes; can be either an object with arrays of numbers or the instances of `Group`, arrays will be converted to instances if provided.
   */
  constructor(groups: Array<Group> | { [owner in GroupName]: number[] } = defaultOwnersToHexes) {
    super();

    this.hexesToOwners = {};
    this.ownersToHexes = {};

    // change into group instances
    if (Array.isArray(groups[Object.keys(groups)[0]])) {
      for (const [name, array] of Object.entries(groups)) {
        groups[name] = new Group(...array);
      }
    }

    for (const [name, group] of Object.entries(groups)) {
      this.ownersToHexes[name] = group.initialHexes;
      for (const hex of group.initialHexes) {
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

const game = new Game();

function init(_event: any) {
  if (window.innerWidth < 800)
    snackbar.show(
      'Your screen may be too small to properly display this website. Consider using a screen greater than 800px in width.'
    );

  // game.drawHexes('.hexes').drawNavbar('.navbar');

  ReactDOM.render(
    <>
      <div className="modal"></div>

      <Header>
        <Header.Title>1754</Header.Title>
        <Spacer />
        <Header.Text>Offline (not logged in)</Header.Text>
        <Button type="raised" className="button-login">
          Login
        </Button>
      </Header>

      <div className="container">
        <Navbar game={game} className="navbar" />
        <div className="window">
          <object id="north-america-svg" data="/northAmerica.svg" type="image/svg+xml"></object>
          <Hexes game={game} className="hexes" />
        </div>
      </div>

      <h2 className="info-header">Objectives</h2>

      <div className="info-container">
        <div className="content">
          <p>
            The objective of the game is to gain as many spaces as possible on the board. Teams are
            put into divisions according to their advantages at the start of the game and should aim
            to gain more spaces than any other team in their division in all classes.
          </p>

          <div className="flex">
            <div>
              <strong>Division 1</strong>
              <span>France</span>
              <span>Britain</span>
            </div>

            <div>
              <strong>Division 2</strong>
              <span>Mohawk</span>
              <span>Shawnee</span>
              <span>Miami</span>
            </div>

            <div>
              <strong>Division 3</strong>
              <span>Ojibwe</span>
              <span>Cherokee</span>
            </div>

            <div></div>
          </div>
        </div>
      </div>

      <h2 className="info-header">Rules</h2>

      <div className="info-container">
        <ol className="content">
          <li>You can only attack a space that is connected to one you control.</li>
          <li>Alliances can be broken by either party at any time.</li>
          <li>
            If you win a battle as the aggressor, you gain the space you attacked. Your turn
            continues and you may attack another space until you win three spaces, pass, or lose.
          </li>
          <li>If you lose a battle, you subtract one from your roll number.</li>
          <li>
            If you are being attacked, you may forfeit the space to the attacker, which allows you
            to keep your roll number the same.
          </li>
          <li>
            If an alliance loses a battle, every member of the alliance loses one from their roll
            number.
          </li>
          <li>
            The minimum roll number for Britain and France is 12. The minimum roll number for all
            other groups is 6.
          </li>
          <li>In the event of a tie, both sides roll again.</li>
          <li>You cannot lose your last space until there is only one round left in the game.</li>
        </ol>
      </div>
    </>,
    document.querySelector('#app')
  );

  $('.button-login').on('click', () => (location.href = './login'));
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', () => (document.body.style.visibility = 'visible'));
