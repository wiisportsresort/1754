import * as $ from 'jquery';
import * as React from 'react';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import { RegisterRequest, RegisterResponse } from '../../../server/types';
import { Button } from '../common/components/button';
import { Header, Spacer } from '../common/components/header';
import { SemanticColors } from '../common/hexdata';
import { HTMLFormProps } from '../common/props';

declare global {
  interface Window {
    init: () => any;
    allowSubmission: () => any;
    denySubmission: () => any;
  }
  const grecaptcha: {
    reset: () => void;
    render: (
      container: string | HTMLElement | Element,
      options: {
        sitekey?: string;
        theme?: 'dark' | 'light';
        size?: 'compact' | 'normal';
        tabindex?: number;
        callback?: () => any;
        'expired-callback'?: () => any;
        'error-callback'?: () => any;
      }
    ) => void;
  };
}

class RegisterForm extends Component<HTMLFormProps, {}> {
  render() {
    return (
      <form {...this.props}>
        <div className="form-container">
          <div className="form-header">
            <h2>Register</h2>
            <div id="spacer"></div>
          </div>

          <label htmlFor="form-id" id="form-id-label">
            <input id="form-id" placeholder="Username" />
          </label>
          <label htmlFor="form-secret" id="form-secret-label">
            <input type="password" id="form-secret" placeholder="Password" />
          </label>
          <label htmlFor="form-secret-check" id="form-secret-check-label">
            <input type="password" id="form-secret-check" placeholder="Confirm Password" />
          </label>

          <div id="recaptcha"></div>

          <Button disabled color={SemanticColors.france} className="button-register">
            Login
          </Button>

          <div className="form-response"></div>
        </div>
      </form>
    );
  }
}

function renderForm() {
  $('.header-button--back').on('click', () => (window.location.href = '../'));

  ReactDOM.render(
    <>
      <Header>
        <Header.Title>1754</Header.Title>
        <Spacer />
        <Button className="header-button-back">Back</Button>
      </Header>

      <RegisterForm className="register-form" />
    </>,
    document.querySelector('#app')
  );

  const response = document.querySelector('.form-response');

  // typescript angery if this is not here
  if (response == null) throw new Error('oh noes');

  (function attatchFormListeners() {
    $('.button-register').on('click', function (event) {
      event.preventDefault();
      denySubmission();

      ReactDOM.unmountComponentAtNode(response);
      ReactDOM.render(
        <>
          <div className="circular-progress-indicator"></div>Waiting for response...
        </>,
        response
      );

      const id = $('#form-id').val() as string;
      const secret = $('#form-secret').val() as string;
      const data: RegisterRequest = { id, secret };

      $.ajax({
        url: 'api/auth/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
      })
        .done(function (data: RegisterResponse) {
          console.log('Register request done.');
          console.log(data);
          if (!data.success) {
            ReactDOM.render(<div className="error">Error: {data.reason}</div>, response);
          } else {
            ReactDOM.render(<div className="success">Success! Redirecting...</div>, response);
            setTimeout(() => (location.href = '/'), 500);
          }
          grecaptcha.reset();
          denySubmission();
        })
        .fail(function (data) {
          console.log('Register request failed.');
          console.log(data);
          grecaptcha.reset();
          denySubmission();
        });
    });

    const $registerButton = $('.button-register');
    const allowSubmission = () => $registerButton.removeAttr('disabled');
    const denySubmission = () => $registerButton.attr('disabled');

    window.allowSubmission = allowSubmission;
    window.denySubmission = denySubmission;
  })();
}

window.init = () => {
  renderForm();

  const recaptchaEl = document.querySelector('#recaptcha');
  if (recaptchaEl != null)
    grecaptcha.render(recaptchaEl, {
      sitekey: process.env.GRECAPTCHA_SITE_KEY,
      theme: 'dark',
      'expired-callback': window.denySubmission,
      callback: window.allowSubmission,
    });

  $('.header-button-back').on('click', () => (location.href = '/'));
};

window.addEventListener('load', () => (document.body.style.visibility = 'visible'));