import { RegisterRequest, RegisterResponse } from '../../../server/types';
import { Button } from '../common/components/button';
import { Header } from '../common/components/header';
import { HTMLFormProps, SemanticColors } from '../common/types';
import { startApp, unmountAll } from '../common/util';
import './index.scss';

const React = await import('react');
const { Component } = React;

declare global {
  interface Window {
    registerForm: RegisterForm | null;
  }
}

class RegisterForm extends Component<HTMLFormProps, {}> {
  registerButtonRef: React.RefObject<Button>;

  constructor(props: Readonly<HTMLFormProps>) {
    super(props);
    this.registerButtonRef = React.createRef<Button>();
  }

  /** Enable the submission button. */
  enable() {
    this.registerButtonRef.current?.modify({
      disabled: false,
    });
  }

  /** Disable the submission button. */
  disable() {
    this.registerButtonRef.current?.modify({
      disabled: true,
    });
  }

  render() {
    return (
      <form {...this.props}>
        <div className="form-container">
          <div className="form-header">
            <h2>Register</h2>
            <div id="spacer"></div>
          </div>
          <div className="label-wrapper">
            <label htmlFor="form-id" id="form-id-label"></label>
          </div>
          <input id="form-id" placeholder="Username" />

          <div className="label-wrapper">
            <label htmlFor="form-secret" id="form-secret-label"></label>
          </div>
          <input type="password" id="form-secret" placeholder="Password" />

          <div className="label-wrapper">
            <label htmlFor="form-secret-check" id="form-secret-check-label"></label>
          </div>
          <input type="password" id="form-secret-check" placeholder="Confirm Password" />

          <div id="recaptcha"></div>

          <Button
            ref={this.registerButtonRef}
            disabled
            color={SemanticColors.france}
            className="button-register"
            stateful={true}
          >
            Login
          </Button>

          <div id="form-response"></div>
        </div>
      </form>
    );
  }
}
function PasswordError() {
  return <span className="error">Passwords do not match.</span>;
}

const animateIn = {
    // height: '1rem',
    opacity: '1',
  },
  animateOut = {
    // height: '0rem',
    opacity: '0',
  };

function App() {
  return (
    <>
      <Header>
        <Header.Title>1754</Header.Title>
        <Header.Spacer />
        <Button id="header-button-back" onClick={() => (location.href = '../')}>
          Back
        </Button>
      </Header>
      <main>
        <RegisterForm
          className="register-form"
          ref={registerForm => (window.registerForm = registerForm)}
        />
      </main>
    </>
  );
}

async function setupForm() {
  const $ = await import('jquery');
  const ReactDOM = await import('react-dom');

  const responseEl = document.querySelector('#form-response'),
    idLabelEl = document.querySelector('#form-id-label'),
    secretLabelEl = document.querySelector('#form-secret-label'),
    secretCheckLabelEl = document.querySelector('#form-secret-check-label');

  const $id = $('#form-id'),
    $idLabel = $('#form-id-label'),
    $secret = $('#form-secret'),
    $secretLabel = $('#form-secret-label'),
    $secretCheck = $('#form-secret-check'),
    $secretCheckLabel = $('#form-secret-check-label');

  function checkSecretMatch() {
    const secretVal = $secret.val() as string;
    const secretCheckVal = $secretCheck.val() as string;

    if (secretVal !== secretCheckVal) {
      $secretLabel.css(animateIn);
      ReactDOM.render(<PasswordError />, secretLabelEl);
      $secretCheckLabel.css(animateIn);
      ReactDOM.render(<PasswordError />, secretCheckLabelEl);
      window.registerForm?.disable();
    } else {
      $secretLabel.css(animateOut);
      $secretCheckLabel.css(animateOut);
      setTimeout(() => unmountAll([secretLabelEl, secretCheckLabelEl]), 250);
      window.registerForm?.enable();
    }
  }

  $secret.on('change', checkSecretMatch);
  $secretCheck.on('change', checkSecretMatch);

  $('.button-register').on('click', function (event) {
    event.preventDefault();
    window.registerForm?.disable();

    const idVal = $id.val() as string;
    const secretVal = $secret.val() as string;
    const secretCheckVal = $secretCheck.val() as string;

    setTimeout(() => unmountAll([idLabelEl, secretLabelEl, secretCheckLabelEl, responseEl]), 250);

    if (secretVal !== secretCheckVal) {
      $secretLabel.css(animateIn);
      ReactDOM.render(<PasswordError />, secretLabelEl);
      $secretCheckLabel.css(animateIn);
      ReactDOM.render(<PasswordError />, secretCheckLabelEl);
      window.registerForm?.enable();
      return;
    }

    ReactDOM.render(
      <>
        <div className="circular-progress-indicator"></div>Waiting for response...
      </>,
      responseEl
    );

    const data: RegisterRequest = {
      id: idVal,
      secret: secretVal,
      recaptchaToken: grecaptcha.getResponse(),
    };

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
          if (data.code === 'ERR-ALREADY-REGISTERED')
            ReactDOM.render(<span className="error">Username is taken.</span>, idLabelEl);
          else ReactDOM.render(<div className="error">Error: {data.reason}</div>, responseEl);
        } else {
          ReactDOM.render(<div className="success">Success! Redirecting...</div>, responseEl);
          setTimeout(() => (location.href = '/'), 2000);
        }
        grecaptcha.reset();
        window.registerForm?.disable();
      })
      .fail(function (data) {
        console.log('Register request failed.');
        console.log(data);
        grecaptcha.reset();
        window.registerForm?.disable();
      });
  });
}

startApp(<App />, () => {
  setupForm();

  const recaptchaEl = document.querySelector('#recaptcha');
  if (recaptchaEl != null && window.registerForm != null)
    grecaptcha.render(recaptchaEl, {
      sitekey: process.env.GRECAPTCHA_SITE_KEY,
      theme: 'dark',
      'expired-callback': () => window.registerForm?.disable(),
      callback: () => window.registerForm?.enable(),
    });
});
