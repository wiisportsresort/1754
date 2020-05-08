import { Header } from '../common/components/header';
import { startApp } from '../common/util';

const React = await import('react');

function App() {
  return (
    <>
      <Header>
        <Header.Title>1754</Header.Title>
        <Header.Spacer />
        <Header.Text>Async import test</Header.Text>
      </Header>

      <main>
        <p>This page was rendered asyncronously!</p>
      </main>
    </>
  );
}

startApp(<App />);
