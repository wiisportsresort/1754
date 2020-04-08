import $ from 'jquery';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem, hideMenu as hideContextMenu } from 'react-contextmenu';
import { EventPipe } from '../../common/event';
import { colors, hexLocations as loc } from '../../common/hexData';
import { capitalize } from '../../common/util';

export class Hexes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      owners: this.props.initialOwners,
    };
  }
  clickHandler(event, detail) {
    if (detail.reset) this.props.eventPipe.dispatch('reset');
    this.assign(detail.hex, detail.group);
  }
  assign(n, owner) {
    const hexUpdate = new CustomEvent('hexupdate', {
      detail: {
        hex: n,
        oldOwner: this.state.owners[n],
        newOwner: owner,
      },
    });
    this.props.eventPipe.dispatch(hexUpdate);

    console.log(`Hex ${n} was assigned to ${capitalize(owner)}`);

    this.setState((state, _props) => {
      state.owners[n] = owner;
      return state;
    });
  }
  makeContextMenuItems(hex) {
    let counter = 0;
    const menuItems = [];
    menuItems.push(
      <span key={counter++} className="react-contextmenu-item no-hover">
        Hex {hex}
      </span>,
      <MenuItem key={counter++} divider />
    );
    for (let group of Object.keys(colors)) {
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
            <path stroke="black" fill={colors[group]} strokeWidth="3" d="M0,0 l50,0 l0,50 l-50,0 l0,-50" />
          </g>
        </svg>
      );

      menuItems.push(
        <MenuItem className="react-contextmenu-item--with-icon" key={counter++} data={{ group, hex }} onClick={this.clickHandler.bind(this)}>
          {icon} {capitalize(group)}
        </MenuItem>
      );
    }
    menuItems.push(
      <MenuItem key={counter++} divider />,
      <MenuItem key={counter++} data={{ reset: true }} onclick={this.clickHandler.bind(this)}>
        Reset
      </MenuItem>
    );
    return menuItems;
  }
  onShowContextMenu() {
    $('#modal')
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
    $('#modal').css({
      height: '0',
      width: '0',
    });
  }

  render() {
    const hexComponents = [];
    for (let i = 1; i < loc.length; i++) {
      let [x, y] = loc[i];
      hexComponents.push(
        <React.Fragment key={i}>
          <ContextMenuTrigger holdToDisplay={1} id={`hex${i}-context-menu`}>
            <Hex number={i} color={colors[this.state.owners[i]]} left={x} top={y} />
          </ContextMenuTrigger>
          <ContextMenu onShow={this.onShowContextMenu} onHide={this.onHideContextMenu} id={`hex${i}-context-menu`}>
            {this.makeContextMenuItems(i)}
          </ContextMenu>
        </React.Fragment>
      );
    }
    return <>{hexComponents}</>;
  }
}
Hexes.propTypes = {
  initialOwners: PropTypes.object.isRequired,
  eventPipe: PropTypes.instanceOf(EventPipe).isRequired,
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
          OUserSelect: 'none',
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
  color: PropTypes.string.isRequired,
};
