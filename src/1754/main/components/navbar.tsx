import * as React from 'react';
import { Component } from 'react';
import { colors, SemanticColors } from '../../common/hexdata';
import { capitalize, EventPipe } from '../../common/util';
import { Button } from '../../common/components/button';
import { HTMLDivProps, HexContextClickData, GroupName } from '../../common/props';
import { Game } from '..';

interface NavbarProps extends HTMLDivProps {
  game: Game;
} 

export class Navbar extends Component<NavbarProps, { counts: {} }> {
  constructor(props: Readonly<NavbarProps>) {
    super(props);

    this.state = { counts: {} };

    const { ownersToHexes } = this.props.game;

    for (const group of Object.keys(colors) as GroupName[]) {
      this.state.counts[group] = ownersToHexes[group].length;
    }
  }
  componentDidMount() {
    this.props.game.on('hexupdate', (event: { detail: HexContextClickData }) => {
      const { oldOwner, newOwner } = event.detail;
      if (oldOwner == undefined || newOwner == undefined) {
        throw new Error('Error: event "hexupdate" was dispatched without correct owner details.');
      }
      this.setState((state, _props) => {
        state.counts[oldOwner]--;
        state.counts[newOwner]++;
        return state;
      });
    });
    this.props.game.on('navbarreset', () => {
      const { ownersToHexes } = this.props.game;
      const newState = { counts: {} };
      for (const group of Object.keys(colors)) {
        newState.counts[group] = ownersToHexes[group].length;
      }
      this.setState(newState);
    });
  }
  
  reset() {
    this.props.game.dispatch(new CustomEvent('reset'));
  }

  render() {
    const scoreButtons: Array<JSX.Element> = [];
    for (let group of Object.keys(colors) as GroupName[]) {
      scoreButtons.push(<ScoreButton key={group} group={group} value={this.state.counts[group]} />);
    } 

    const { className, game, ...otherProps } = this.props;
    return (
      <div className={className} {...otherProps}>
        <Button id="navbar-button-reset" type="flat" onClick={this.reset}>
          <i className="fas fa-sync-alt"></i> reset
        </Button>
        {scoreButtons}
      </div>
    );
  }
}

export class ScoreButton extends Component<{ group: GroupName; value: number }, {}> {
  render() {
    const { group, value } = this.props;
    const disabled = value === 0;
    return (
      <Button
        disabled={disabled}
        id={`score-button-${group}`}
        type="raised"
        color={SemanticColors[group]}
      >
        {capitalize(group)}: <span id={`score-${group}`}>{value}</span>
      </Button>
    );
  }
}
