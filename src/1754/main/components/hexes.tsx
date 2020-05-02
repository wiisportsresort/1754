import * as $ from 'jquery';
import * as React from 'react';
import { Component } from 'react';
import { ContextMenu, ContextMenuTrigger, hideMenu as hideContextMenu, MenuItem } from 'react-contextmenu';
import { Game } from '..';
import { colors, hexLocations as loc } from '../../common/hexdata';
import { GroupName, HexContextClickData, HTMLDivProps } from '../../common/props';
import { capitalize } from '../../common/util';

interface HexesProps extends HTMLDivProps {
  game: Game;
}

export class Hexes extends Component<HexesProps, {}> {
  render() {
    const { game, className, ...otherProps } = this.props;
    const hexComponents: Array<JSX.Element> = [];
    for (let i = 1; i < loc.length; i++) {
      hexComponents.push(<HexWrapper key={i} game={game} hexNumber={i} offset={loc[i]} />);
    }
    return (
      <div className={className} {...otherProps}>
        {hexComponents}
      </div>
    );
  }
}

interface HexWrapperProps {
  game: Game;
  hexNumber: number;
  offset: [number, number];
}

class HexWrapper extends Component<HexWrapperProps, { owner: GroupName }> {
  hexNumber: number;

  constructor(props: Readonly<HexWrapperProps>) {
    super(props);

    this.state = {
      owner: this.props.game.hexesToOwners[this.props.hexNumber],
    };

    this.hexNumber = this.props.hexNumber;
  }

  componentDidMount() {
    this.props.game.on('hexesreset', () => {
      this.setState({
        owner: this.props.game.hexesToOwners[this.hexNumber],
      });
    });
    this.props.game.on('hexreset', (event: { detail: HexContextClickData }) => {
      if (event.detail.hexNumber == this.hexNumber)
        this.setState({
          owner: this.props.game.hexesToOwners[this.hexNumber],
        });
    });
  }

  makeContextMenuItems(hexNumber: number) {
    let counter = 0;
    const menuItems: Array<JSX.Element> = [];
    menuItems.push(
      <span key={counter++} className="react-contextmenu-item no-hover">
        Hex {hexNumber}
      </span>,
      <MenuItem key={counter++} divider />
    );
    for (const group of Object.keys(colors) as GroupName[]) {
      const icon = (
        <svg
          style={{ width: '16px', height: '16px' }}
          id="northAmerica"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 50 50"
        >
          <title>icon</title>
          <g>
            <path
              stroke="black"
              fill={colors[group]}
              strokeWidth="3"
              d="M0,0 l50,0 l0,50 l-50,0 l0,-50"
            />
          </g>
        </svg>
      );

      const data: HexContextClickData = {
        newOwner: group,
        hexNumber: hexNumber,
        oldOwner: this.state.owner,
      };

      menuItems.push(
        <MenuItem
          className="react-contextmenu-item--with-icon"
          key={counter++}
          data={data}
          onClick={this.clickHandler.bind(this)}
        >
          {icon} {capitalize(group)}
        </MenuItem>
      );
    }

    const resetData: HexContextClickData = {
      reset: true,
      hexNumber: hexNumber,
    };

    menuItems.push(
      <MenuItem key={counter++} divider />,
      <MenuItem key={counter++} data={resetData} onClick={this.clickHandler.bind(this)}>
        Reset
      </MenuItem>
    );
    return menuItems;
  }

  clickHandler(_event: any, detail: any) {
    if (detail.reset) {
      this.props.game.dispatch(
        new CustomEvent('hexreset', {
          detail: {
            reset: true,
            hexNumber: this.hexNumber,
          } as HexContextClickData,
        })
      );
      return;
    }

    const e = new CustomEvent('hexupdate', { detail });
    this.props.game.dispatch(e);

    this.setState({ owner: detail.newOwner });
  }

  onShowContextMenu() {
    $('.modal')
      .css({
        height: '100vh',
        width: '100vw',
      })
      .on('click', () => {
        $('#modal').css({
          height: '0',
          width: '0',
        });

        hideContextMenu();
      });
  }

  onHideContextMenu() {
    $('.modal').css({
      height: '0',
      width: '0',
    });
  }

  render() {
    return (
      <>
        <ContextMenuTrigger holdToDisplay={1} id={`hex${this.props.hexNumber}-context-menu`}>
          <Hex
            number={this.props.hexNumber}
            owner={this.state.owner}
            left={this.props.offset[0]}
            top={this.props.offset[1]}
          />
        </ContextMenuTrigger>
        <ContextMenu
          onShow={this.onShowContextMenu}
          onHide={this.onHideContextMenu}
          id={`hex${this.props.hexNumber}-context-menu`}
        >
          {this.makeContextMenuItems(this.props.hexNumber)}
        </ContextMenu>
      </>
    );
  }
}

interface HexProps {
  number: number;
  top: number;
  left: number;
  owner: string;
}

class Hex extends Component<HexProps, {}> {
  render() {
    return (
      <svg
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
        }}
      >
        <title>Hex {this.props.number}</title>
        <path
          className="stroke"
          style={{
            fill: colors[this.props.owner],
          }}
          id={`hex${this.props.number}fill`}
          d="M14.6,51.2l-10-20c-0.7-1.4-0.7-3.1,0-4.5l10-20C15.5,5.1,17.2,4,19.1,4h18.8c1.9,0,3.6,1.1,4.5,2.8l10,20
          c0.7,1.4,0.7,3.1,0,4.5l-10,20c-0.8,1.7-2.6,2.8-4.5,2.8H19.1C17.2,54,15.5,52.9,14.6,51.2z"
        />
        <text
          transform="matrix(1 0 0 1 28.5 38.6973)"
          className="text"
          id={`hex${this.props.number}text`}
        >
          {this.props.number}
        </text>
      </svg>
    );
  }
}
