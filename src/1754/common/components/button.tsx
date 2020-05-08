import classNames from 'classnames';
import { css } from 'emotion';
import { colors } from '../hexdata';
import { Colors, HTMLButtonProps, HTMLDivProps, SemanticColors } from '../types';
import './button.scss';

const React = await import('react');
const { Component } = React;


type ButtonType = 'flat' | 'raised';

interface ButtonProps extends Omit<HTMLButtonProps, 'color' | 'type'> {
  color?: SemanticColors | Colors;
  type?: ButtonType;
  htmlType?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
  stateful?: boolean;
}

interface ButtonState {
  disabled: boolean;
  color: SemanticColors | Colors | '#ddd';
}

interface ButtonUpdate {
  disabled?: boolean;
  color?: SemanticColors | Colors | '#ddd';
}

export class Button extends Component<ButtonProps, ButtonState> {
  constructor(props: Readonly<ButtonProps>) {
    super(props);

    const { disabled, color, stateful } = this.props;

    if (stateful) {
      this.state = {
        disabled: disabled ?? false,
        color: color ?? '#ddd',
      };
    }
  }

  modify(newState: ButtonUpdate) {
    if (this.props.stateful) {
      this.setState({
        color: newState.color ?? this.state.color,
        disabled: newState.disabled ?? this.state.disabled,
      });
    } else throw new Error('Error: modify() called on a stateless button.');
  }

  render() {
    const {
      color: _,
      disabled: __,
      className,
      children,
      htmlType,
      type,
      ...otherProps
    } = this.props;

    let color: SemanticColors | Colors | '#ddd', disabled: boolean;

    if (this.props.stateful) {
      color = this.state.color;
      disabled = this.state.disabled;
    } else {
      color = this.props.color!;
      disabled = this.props.disabled!;
    }

    const buttonColor: string = colors[color ?? ''] ?? '#ddd';
    const colorWithOpacity = buttonColor + (disabled ? '33' : 'ff');
    return (
      <button
        {...otherProps}
        disabled={disabled}
        type={htmlType}
        className={classNames(
          'button',
          type == undefined ? 'raised' : type,
          css({
            background: colorWithOpacity,
            '&:hover:not(:disabled)': {
              background: 'transparent',
              color: buttonColor,
              border: '2px solid ' + buttonColor,
            },
          }),
          className
        )}
      >
        {children}
      </button>
    );
  }
}

export interface IconButtonProps extends Omit<HTMLButtonProps, 'color' | 'type'> {
  icon: string;
  htmlType?: 'button' | 'reset' | 'submit';
}

export class IconButton extends React.Component<IconButtonProps> {
  render() {
    const { icon, htmlType, className, ...otherProps } = this.props;
    return (
      <button className={classNames('icon-button', className)} type={htmlType} {...otherProps}>
        <Icon icon={icon} />
      </button>
    );
  }
}

interface IconProps extends HTMLDivProps {
  icon: string;
}

export class Icon extends Component<IconProps, {}> {
  render() {
    const { icon, className, ...otherProps } = this.props;
    return <i className={classNames('icon', icon, className)} {...otherProps}></i>;
  }
}
