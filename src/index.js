
import { AppContainer } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import React from 'react';
import Demo from './demo';

const rootEl = document.getElementById('root');

ReactDOM.render(
  <AppContainer>
    <Demo />
  </AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('./demo', () => {
    // eslint-disable-next-line
    const NextApp = require('./demo').default;
    ReactDOM.render(
      <AppContainer>
        <Demo />
      </AppContainer>,
      rootEl
    );
  });
}
