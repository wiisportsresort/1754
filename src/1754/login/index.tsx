import * as $ from 'jquery';
import * as React from 'react';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import { LoginRequest } from '../../../server/types';
import { Button, Icon, IconButton } from '../common/components/button';
import { SemanticColors } from '../common/hexdata';
import { Header, Spacer } from '../common/components/header';

class StudentForm extends Component {
  render() {
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

          <Button color={SemanticColors.mohawk} className="button-login" type="raised">
            Join
          </Button>
        </div>
      </form>
    );
  }
}

class TeacherForm extends Component {
  render() {
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
}

function attachButtonListeners() {
  $('.header-button-back').on('click', () => (location.href = '../'));

  const $loginSelector = $('.login-selector');
  const $loginForm = $('.login-form');

  function attatchFormListeners() {
    $('.button-back').on('click', () => {
      console.log('a');

      $loginSelector.css('max-height', '400px');
      $loginForm.css('max-height', '0px');
      setTimeout($loginForm.children().remove, 500);
    });

    $('.button-login').on('click', function (event) {
      event.preventDefault();
      const $this = $(this);
      const isStudent = $this.hasClass('.form-button--student');
      const id = $('#form-id').val() as string;
      const secret = $('#form-secret').val() as string;
      const data: LoginRequest = {
        type: isStudent ? 'student' : 'teacher',
        id,
        secret,
      };
      $.ajax({
        url: 'api/auth/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
      })
        .done(function () {
          console.log('POST request done.');
          console.log(arguments[0]);
        })
        .fail(function () {
          console.log('POST request failed.');
          console.log(arguments[0]);
        });
    });
  }

  $('.login-selector-student').on('click', () => {
    $loginSelector.css('max-height', '0px');
    ReactDOM.render(<StudentForm />, document.querySelector('.login-form'));
    $loginForm.css('max-height', '400px');
    attatchFormListeners();
  });
  $('.login-selector-teacher').on('click', () => {
    $loginSelector.css('max-height', '0px');
    ReactDOM.render(<TeacherForm />, document.querySelector('.login-form'));
    $loginForm.css('max-height', '400px');
    attatchFormListeners();
  });
}

function init() {
  ReactDOM.render(
    <>
      <Header>
        <Header.Title>1754</Header.Title>
        <Spacer />
        <Button className="header-button-back">Back</Button>
      </Header>

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
    </>,
    document.querySelector('#app')
  );

  attachButtonListeners();
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', () => (document.body.style.visibility = 'visible'));
