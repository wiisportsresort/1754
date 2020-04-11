import $ from 'jquery';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

class StudentForm extends Component {
  render() {
    return (
      <form method="POST" action="/api/auth/student">
        <div className="form-container form-container--student">
          <div className="form-header">
            <button type="button" className="icon-button form-button--back">
              <i className="fas fa-arrow-left"></i>
            </button>

            <h2>Join a Game</h2>
            <div id="spacer"></div>
          </div>

          <input name="gameCode" id="student-game-code" placeholder="Game code" />

          <button type="submit" className="form-button form-button--login form-button--student">
            Join
          </button>
        </div>
      </form>
    );
  }
}

class TeacherForm extends Component {
  render() {
    return (
      <form method="POST" action="/api/auth/teacher">
        <div className="form-container form-container--teacher">
          <div className="form-header">
            <button type="button" className="icon-button form-button--back">
              <i className="fas fa-arrow-left"></i>
            </button>

            <h2>Teacher Login</h2>
            <div id="spacer"></div>
          </div>
          <input name="username" id="teacher-username" placeholder="Username" />

          <input name="password" type="password" id="teacher-passsword" placeholder="Password" />

          <button type="submit" className="form-button form-button--submit form-button--teacher">
            Login
          </button>
        </div>
      </form>
    );
  }
}
function attachButtonListeners() {
  $('.header-button--back').on('click', () => {
    window.location.href = '/';
  });

  function attachBackButtonListener() {
    $('.form-button--back').on('click', () => {
      console.log('a');

      $('#login').css('max-height', '400px');
      $('#login-form').css('max-height', '0px');
      setTimeout($('#login-form').children().remove, 500);
    });
  }

  $('.form-button--student').on('click', () => {
    $('#login').css('max-height', '0px');
    ReactDOM.render(<StudentForm />, document.querySelector('#login-form'));
    $('#login-form').css('max-height', '400px');
    attachBackButtonListener();
  });
  $('.form-button--teacher').on('click', () => {
    $('#login').css('max-height', '0px');
    ReactDOM.render(<TeacherForm />, document.querySelector('#login-form'));
    $('#login-form').css('max-height', '400px');
    attachBackButtonListener();
  });
}

function init() {
  attachButtonListeners();
}


window.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', () => (document.body.style.visibility = 'visible'));
