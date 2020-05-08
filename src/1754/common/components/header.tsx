import classNames from 'classnames';
import { HTMLDivProps } from '../types';
import './header.scss';

const React = await import('react');
const { Component } = React;

function Spacer() {
  return <div style={{ flexGrow: 1 }}></div>;
}

function HeaderText(props: HTMLDivProps) {
  const { className, children, ...otherProps } = props;
  return (
    <span className={classNames('text', className)} {...otherProps}>
      {children}
    </span>
  );
}

function HeaderTitle(props: HTMLDivProps) {
  const { className, children, ...otherProps } = props;
  return (
    <h1 className={classNames('title', className)} {...otherProps}>
      {children}
    </h1>
  );
}

export class Header extends Component<HTMLDivProps, {}> {
  static Text = HeaderText;
  static Title = HeaderTitle;
  static Spacer = Spacer;

  render() {
    const { className, children, ...otherProps } = this.props;
    return (
      <header {...otherProps} className={classNames('header', className)}>
        {children}
      </header>
    );
  }
}
