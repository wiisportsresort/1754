import React, { Component } from 'react';
import PropTypes from 'prop-types';
const capitalize = string => string[0].toUpperCase() + string.slice(1);

export class Navbar extends Component {
  render() {
    return (
      <>
        <ResetButton />
        <ScoreButton group="france" initialValue={7} />
        <ScoreButton group="britain" initialValue={7} />
        <ScoreButton group="mohawk" initialValue={4} />
        <ScoreButton group="cherokee" initialValue={3} />
        <ScoreButton group="shawnee" initialValue={4} />
        <ScoreButton group="miami" initialValue={4} />
        <ScoreButton group="ojibwe" initialValue={3} />
      </>
    );
  }
}
export class ResetButton extends Component {
  render() {
    return (
      <button className="navbar-button" id="navbar-button-reset">
        <i className="fas fa-sync-alt"></i> reset
      </button>
    );
  }
}
export class ScoreButton extends Component {
  render() {
    return (
      <button className="navbar-button score-button" id={`score-button-${this.props.group}`}>
        {capitalize(this.props.group)}: <span id={`score-${this.props.group}`}>{this.props.initialValue}</span>
      </button>
    );
  }
}
ScoreButton.propTypes = {
  group: PropTypes.string.isRequired,
  initialValue: PropTypes.number.isRequired,
}
