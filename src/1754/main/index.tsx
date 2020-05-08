import { Button } from '../common/components/button';
import { Header } from '../common/components/header';
import { Game } from '../common/game';
import { startApp } from '../common/util';
import { Hexes } from './components/hexes';
import { Navbar } from './components/navbar';
import { Objectives, Rules } from './components/text';
import './index.scss';

// React must be in scope to instantiate JSX functions or classes
const React = await import('react');

const game = new Game();

function App() {
  return (
    <>
      <div className="modal"></div>

      <Header>
        <Header.Title>1754</Header.Title>
        <Header.Spacer />
        <Header.Text>Offline (not logged in)</Header.Text>
        <Button type="raised" id="button-login" onClick={() => (location.href = './login')}>
          Login
        </Button>
      </Header>

      <main>
        <div className="container">
          <Navbar game={game} className="navbar" />
          <div className="window">
            <object id="north-america-svg" data="/northAmerica.svg" type="image/svg+xml"></object>
            <Hexes game={game} className="hexes" />
          </div>
        </div>

        <Objectives />
        <Rules />
      </main>
    </>
  );
}

startApp(<App />);
