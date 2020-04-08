import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EventPipe } from '../../common/event';
import { colors } from '../../common/hexData';
import { capitalize } from '../../common/util';

export class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = { counts: {} };

    for (let group of Object.keys(colors)) {
      this.state.counts[group] = this.props.initialOwnedHexes[group].length;
    }
  }
  componentDidMount() {
    this.props.eventPipe.on('hexupdate', event => {
      const { oldOwner, newOwner } = event.detail;
      this.setState((state, _props) => {
        state.counts[oldOwner]--;
        state.counts[newOwner]++;
        return state;
      })
    });
  }
  render() {
    const scoreButtons = [];
    for (let group of Object.keys(colors)) {
      scoreButtons.push(<ScoreButton key={group} group={group} value={this.state.counts[group]} />);
    }
    return (
      <>
        <ResetButton />
        {scoreButtons}
      </>
    );
  }
}
Navbar.propTypes = {
  initialOwnedHexes: PropTypes.object.isRequired,
  eventPipe: PropTypes.instanceOf(EventPipe).isRequired,
};
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
        {capitalize(this.props.group)}: <span id={`score-${this.props.group}`}>{this.props.value}</span>
      </button>
    );
  }
}
ScoreButton.propTypes = {
  group: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};
