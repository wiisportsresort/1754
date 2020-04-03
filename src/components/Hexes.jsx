import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hexLocations as loc, colors } from '../common';

/** 
 * Captializes the first letter in the string. 
 * Does not capitalize every word in the string.
 * @param {string} string - string to captialize.
 */
const captialize = string => string.charAt(0).toUpperCase() + string.slice(1);

export class Hexes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      owners: this.props.initialOwners
    };
  }
  assign(n, owner) {
    // this.hexComponents[n] = null;
    // this.hexComponents[n] = <Hex key={n} number={n} color={colors[owner]} left={loc[n][0]} top={loc[n][1]} />
    this.setState((state, _props) => {
      state.owners[n] = owner;
      return state;
    });

    console.log(`Hex ${n} was assigned to ${captialize(owner)}`)
  }
  componentDidMount() {
    [].map.call(document.querySelectorAll('.hex'), el => {
      el.addEventListener('click', _event => {
        const thisHex = parseInt(el.id.substring(3));
        const currentColor = this.state.owners[thisHex];

        const groups = Object.keys(colors);

        let index;
        if (groups.indexOf(currentColor) < groups.length - 1) index = groups.indexOf(currentColor) + 1;
        else index = 0;

        const randomColor = groups[index];

        this.assign(thisHex, randomColor);
      });
    });
  }
  render() {
    const hexComponents = [];
    for (let i = 1; i < loc.length; i++) {
      let [x, y] = loc[i];
      hexComponents.push(<Hex key={i} number={i} color={colors[this.state.owners[i]]} left={x} top={y} />);
    }
    return <>{hexComponents}</>;
  }
}
Hexes.propTypes = {
  initialOwners: PropTypes.object.isRequired
};

export class Hex extends Component {
  render() {
    return (
      <svg
        unselectable="on"
        onSelect={() => false}
        onMouseDown={() => false}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlSpace="preserve"
        x="0px"
        y="0px"
        viewBox="0 0 57 58"
        id={`hex${this.props.number}`}
        className="hex"
        style={{
          top: this.props.top + 'px',
          left: this.props.left + 'px',
          MozUserSelect: 'none',
          WebkitUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
          OUserSelect: 'none'
        }}
      >
        <title>Hex {this.props.number}</title>
        <path
          className="hex-stroke"
          style={{
            fill: this.props.color,
            
          }}
          id={`hex${this.props.number}fill`}
          d="M14.6,51.2l-10-20c-0.7-1.4-0.7-3.1,0-4.5l10-20C15.5,5.1,17.2,4,19.1,4h18.8c1.9,0,3.6,1.1,4.5,2.8l10,20
          c0.7,1.4,0.7,3.1,0,4.5l-10,20c-0.8,1.7-2.6,2.8-4.5,2.8H19.1C17.2,54,15.5,52.9,14.6,51.2z"
        />
        <text transform="matrix(1 0 0 1 28.5 38.6973)" className="hex-text" id={`hex${this.props.number}text`}>
          {this.props.number}
        </text>
      </svg>
    );
  }
}
Hex.propTypes = {
  number: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
};
