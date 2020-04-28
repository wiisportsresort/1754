import * as $ from 'jquery';
import * as React from 'react';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import './index.scss';
import { LoginData } from '../../types';

class StudentForm extends Component {
  render() {
    return (
      <form>
        <div className="form-container form-container--student">
          <div className="form-header">
            <button type="button" className="icon-button form-button--back">
              <i className="fas fa-arrow-left"></i>
            </button>

            <h2>Join a Game</h2>
            <div id="spacer"></div>
          </div>

          <input id="form-id" placeholder="Name" />
          <input id="form-secret" placeholder="Game code" />

          <button className="form-button form-button--login form-button--student">Join</button>
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
            <button className="icon-button form-button--back">
              <i className="fas fa-arrow-left"></i>
            </button>

            <h2>Teacher Login</h2>
            <div id="spacer"></div>
          </div>

          <input id="form-id" placeholder="Username" />
          <input type="password" id="form-secret" placeholder="Password" />

          <button className="form-button form-button--submit form-button--teacher">Login</button>
        </div>
      </form>
    );
  }
}

function attachButtonListeners() {
  $('.header-button--back').on('click', () => {
    window.location.href = '/';
  });

  const $login = $('#login');
  const $loginForm = $('#login-form');

  function attatchFormListeners() {
    $('.form-button--back').on('click', () => {
      console.log('a');

      $login.css('max-height', '400px');
      $loginForm.css('max-height', '0px');
      setTimeout($loginForm.children().remove, 500);
    });

    $('.form-button--submit').on('click', function (event) {
      event.preventDefault();
      const $this = $(this);
      const isStudent = $this.hasClass('.form-button--student');
      const id = $('#form-id').val() as string;
      const secret = $('#form-secret').val() as string;
      const data: LoginData = {
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
          console.log('POST request failed.');
          console.log(arguments);
        })
        .fail(function () {
          console.log('POST request failed.');
          console.log(arguments);
        });
    });
  }

  $('.form-button--student').on('click', () => {
    $login.css('max-height', '0px');
    ReactDOM.render(<StudentForm />, document.querySelector('#login-form'));
    $loginForm.css('max-height', '400px');
    attatchFormListeners();
  });
  $('.form-button--teacher').on('click', () => {
    $login.css('max-height', '0px');
    ReactDOM.render(<TeacherForm />, document.querySelector('#login-form'));
    $loginForm.css('max-height', '400px');
    attatchFormListeners();
  });
}

function init() {
  attachButtonListeners();
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', () => (document.body.style.visibility = 'visible'));
