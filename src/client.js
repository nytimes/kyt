
import { AppContainer } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import React from 'react';
import TestComponent from './components/TestComponent';

const rootEl = document.getElementById('root');

ReactDOM.render(
  <AppContainer>
    <TestComponent />
  </AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('./components/TestComponent', () => {
    // eslint-disable-next-line
    const NextApp = require('./components/TestComponent').default;
    ReactDOM.render(
      <AppContainer>
        <TestComponent />
      </AppContainer>,
      rootEl
    );
  });
}
