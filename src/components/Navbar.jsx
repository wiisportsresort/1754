import React, { Component } from 'react';
const capitalize = string => string[0].toUpperCase() + string.slice(1);

export class Navbar extends Component {
  render() {
    return (
      <>
        <ResetButton />
        <ScoreButton group="france" initialValue="7" />
        <ScoreButton group="britain" initialValue="7" />
        <ScoreButton group="mohawk" initialValue="4" />
        <ScoreButton group="cherokee" initialValue="3" />
        <ScoreButton group="shawnee" initialValue="4" />
        <ScoreButton group="miami" initialValue="4" />
        <ScoreButton group="ojibwe" initialValue="3" />
      </>
    );
  }
}
export class ResetButton extends Component {
  render() {
    return (
      <button class="navbar-button" id="reset-button">
        <i class="fas fa-sync-alt"></i>reset
      </button>
    );
  }
}
export class ScoreButton extends Component {
  render() {
    return (
      <button className="navbar-button" id={`score-button-${this.props.group}`}>
        {capitalize(this.props.group)}: <span id={`score-${this.props.group}`}>{this.props.initialValue}</span>
      </button>
    );
  }
}
