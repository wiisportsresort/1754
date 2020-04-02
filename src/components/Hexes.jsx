import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hexLocations as loc, colors } from '../common';

export class Hexes extends Component {
  constructor(props) {
    super(props);

    this.hexComponents = [];
    this.state = {};

    for (let i = 1; i < loc.length; i++) {
      let [x, y] = loc[i];
      this.hexComponents.push(<Hex key={i} number={i} color={colors[this.props.initialOwners[i]]} left={x} top={y} />);
    }
  }
  reassignHex(n, owner) {
    this.hexComponents[n] = <Hex key={n} number={n} color={colors[owner]} left={loc[n][0]} top={loc[n][1]} />
  }
  render() {
    return <>{this.hexComponents}</>;
  }
}
Hexes.propTypes = {
  initialOwners: PropTypes.object.isRequired
}

export class Hex extends Component {
  render() {
    return (
      <svg
        className="hex"
        version="1.1"
        id={`hex${this.props.number}`}
        style={{ top: this.props.top + 'px', left: this.props.left + 'px' }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 57 58"
        xmlSpace="preserve"
      >
        <title>Hex {this.props.number}</title>
        <path 
          className="hex-stroke"
          style={{ fill: this.props.color }}
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
}