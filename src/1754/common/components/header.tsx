import * as React from 'react';
import { Component } from 'react';
import classNames from 'classnames';
import './header.scss';
import { HTMLDivProps, Alignment } from '../props';

class HeaderText extends Component<HTMLDivProps, {}> {
  render() {
    const { className, children, ...otherProps } = this.props;
    return <span className={classNames('text', className)} {...otherProps}>{children}</span>;
  }
}

class HeaderTitle extends Component<HTMLDivProps, {}> {
  render() {
    const { className, children, ...otherProps } = this.props;
    return <h1 className={classNames('title', className)} {...otherProps}>{children}</h1>;
  }
}

export class Header extends Component<HTMLDivProps, {}> {
  static Text = HeaderText;
  static Title = HeaderTitle;

  render() {
    const { className, children, ...otherProps } = this.props;
    return (
      <div {...otherProps} className={classNames('header', className)}>
        {children}
      </div>
    );
  }
}
/* 
<h1 id="header-title">{title ?? '1754'}</h1>
<div className="spacer"></div>
<span className="header-text header-text--login"></span>
<button className="header-button header-button--login">Login</button> 
*/

export class Spacer extends Component {
  render() {
    return <div style={{ flexGrow: 1 }}></div>;
  }
}
