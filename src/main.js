import ReactDOM from 'react-dom';
import { Hex } from './components/Hex.jsx';
import './main.scss';
import { Navbar } from './components/Navbar.jsx';
import { ScreenTooSmall } from './components/ScreenTooSmall.jsx';
import $ from 'jquery';

/** A representation of a country/tribe. */
class Group {
  /**
   * @param {...number} initalHexes - numbers of the hexes this group starts with.
   */
  constructor(...initalHexes) {
    this.initalHexes = initalHexes;
  }
}

const colors = {
  france: '#3498db',
  britain: '#e94858',
  mohawk: '#82bf6e',
  cherokee: '#9568d0',
  miami: '#d075c3',
  ojibwe: '#fedc30'
};
 
const groups = {
  britain: new Group(1, 4, 13, 14, 15, 16, 25)
};

function drawHexes() {
  ReactDOM.render(<Hex number="1" color={colors.france} top="100px" left="600px" />, document.querySelector('#hex'));
  ReactDOM.render(<Navbar />, document.querySelector('.navbar'));
}

function init(event) {
  // drawHexes();
  // console.log(groups.britain.initalHexes);

  if (window.innerWidth < 800) {
    $('.container').css('display', 'none');
    $('body').css('width', '0')
    ReactDOM.render(<ScreenTooSmall />, document.querySelector('#error'));
  }
  
}

function reset() {}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', () => (document.body.style.visibility = 'visible'));


console.log('hi')


// webpack hot module replacement
if (module.hot) {
  module.hot.accept();
  // module.hot.dispose(function() {
  //   window.location.reload();
  // });
}