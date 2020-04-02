import React, { Component } from 'react';

export class ScreenTooSmall extends Component {
  render() {
    return (
      <div className="error">
        <i className="fas fa-2x fa-exclamation-triangle"></i><br /><br />
        Your screen is too small to properly display this game. Use a display that's at least 600 pixels wide.
      </div>
    )
  }
}