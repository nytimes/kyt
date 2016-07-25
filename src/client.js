
import { AppContainer } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import React from 'react';
import Demo from './components/demo';

const rootEl = document.getElementById('root');

ReactDOM.render(
  <AppContainer>
    <Demo />
  </AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('./components/demo', () => {
    // eslint-disable-next-line
    const NextApp = require('./components/demo').default;
    ReactDOM.render(
      <AppContainer>
        <Demo />
      </AppContainer>,
      rootEl
    );
  });
}
