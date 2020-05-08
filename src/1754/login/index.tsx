import { LoginRequest } from '../../../server/types';
import { Button, Icon, IconButton } from '../common/components/button';
import { Header } from '../common/components/header';
import { Colors, SemanticColors } from '../common/types';
import { startApp } from '../common/util';
import './index.scss';

function StudentForm() {
  return (
    <form>
      <div className="form-container form-container--student">
        <div className="form-header">
          <IconButton htmlType="button" icon="fas fa-arrow-left" className="button-back" />

          <h2>Join a Game</h2>
          <div id="spacer"></div>
        </div>

        <input id="form-id" placeholder="Name" />
        <input id="form-secret" placeholder="Game code" />

        <Button color={Colors.green} className="button-login" type="raised">
          Join
        </Button>
      </div>
    </form>
  );
}

function TeacherForm() {
  return (
    <form>
      <div className="form-container form-container--teacher">
        <div className="form-header">
          <IconButton htmlType="button" icon="fas fa-arrow-left" className="button-back" />

          <h2>Teacher Login</h2>
          <div id="spacer"></div>
        </div>

        <input id="form-id" placeholder="Username" />
        <input type="password" id="form-secret" placeholder="Password" />

        <Button color={SemanticColors.france} className="button-login" type="raised">
          Login
        </Button>
      </div>
    </form>
  );
}

function App() {
  return (
    <>
      <Header>
        <Header.Title>1754</Header.Title>
        <Header.Spacer />
        <Button className="header-button-back" onClick={() => (location.href = '../')}>
          Back
        </Button>
      </Header>
      <main>
        <div className="login-selector">
          <h2>Login</h2>
          <Button className="login-selector-teacher" color={SemanticColors.france}>
            <Icon icon="fas fa-chalkboard-teacher" className="with-text" />
            Teacher
          </Button>
          <Button className="login-selector-student" color={SemanticColors.mohawk}>
            <Icon icon="fas fa-user-graduate" className="with-text" />
            Student
          </Button>
        </div>

        <div className="login-form"></div>
      </main>
    </>
  );
}

async function setupLoginSelector() {
  const $ = await import('jquery');
  const ReactDOM = await import('react-dom');

  const $loginSelector = $('.login-selector');
  const $loginForm = $('.login-form');

  function attatchFormListeners(type = 'student') {
    const isStudent = type === 'student';
    $('.button-back').on('click', () => {
      $loginSelector.css('max-height', '400px');
      $loginForm.css('max-height', '0px');
      setTimeout(() => ReactDOM.unmountComponentAtNode($loginForm[0]), 500);
    });

    $('.button-login').on('click', async event => {
      event.preventDefault();
      const id = $('#form-id').val() as string;
      const secret = $('#form-secret').val() as string;
      const data: LoginRequest = {
        type: isStudent ? 'student' : 'teacher',
        id,
        secret,
      };
      try {
        const response = await $.ajax({
          url: 'api/auth/login',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data),
        });
        console.log('Register HTTP request done.\nResponse:\n' + response);
      } catch (err) {
        console.error('Register HTTP request error:\n' + err);
      }
    });
  }

  $('.login-selector-student').on('click', () => {
    $loginSelector.css('max-height', '0px');
    ReactDOM.render(<StudentForm />, document.querySelector('.login-form'));
    $loginForm.css('max-height', '400px');
    attatchFormListeners('student');
  });

  $('.login-selector-teacher').on('click', () => {
    $loginSelector.css('max-height', '0px');
    ReactDOM.render(<TeacherForm />, document.querySelector('.login-form'));
    $loginForm.css('max-height', '400px');
    attatchFormListeners('teacher');
  });
}

startApp(<App />, () => {
  setupLoginSelector();
});
