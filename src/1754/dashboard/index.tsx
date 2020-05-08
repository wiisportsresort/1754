import { HTTPMethod } from '../../../server/types';
import { Button } from '../common/components/button';
import { Header } from '../common/components/header';
import { Colors, HTMLDivProps } from '../common/types';
import { startApp } from '../common/util';
import './index.scss';

const $ = await import('jquery');
const React = await import('react');
const { Component } = React;

class Dashboard extends Component<HTMLDivProps> {
  buttonRef: React.RefObject<Button>;
  constructor(props: Readonly<HTMLDivProps>) {
    super(props);

    this.buttonRef = React.createRef<Button>();

    setInterval(() => {
      const colorArray: string[] = [];

      for (const color in Colors) {
        colorArray.push(color);
      }

      const randomColor = Colors[colorArray[Math.floor(Math.random() * colorArray.length)]];

      this.buttonRef.current?.modify({
        color: randomColor,
        disabled: Math.random() > 0.5,
      });
    }, 1000);
  }

  render() {
    return (
      <>
        <Button stateful ref={this.buttonRef}>
          Button!
        </Button>
      </>
    );
  }
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

      <div id="dashboard">
        <div id="dashboard-header">
          <h2 className="dashboard-title">Dashboard</h2>
          <div id="spacer"></div>
        </div>
        <div className="dashboard-section" id="dashboard-accounts">
          <h3 className="dashboard-subtitle">Accounts</h3>
          <Dashboard id="dashboard-controls-accounts" />
        </div>
        <div className="dashboard-section" id="dashboard-games">
          <h3 className="dashboard-subtitle">Games</h3>
          <div id="dashboard-controls-games"></div>
        </div>
      </div>
    </>
  );
}

// (function attatchFormListeners() {
//   function someHandler() {
//     const data = {};

//     $jsonRequest('somePath', 'POST', data)
//       .done(res => {})
//       .fail(res => {});
//   }
// })();

const $jsonRequest = (
  url: string,
  method: HTTPMethod,
  data: object,
  otherOptions?: JQuery.AjaxSettings
) => {
  return $.ajax({
    url,
    method,
    data,
    contentType: 'application/json',
    ...otherOptions,
  });
};

startApp(<App />);
