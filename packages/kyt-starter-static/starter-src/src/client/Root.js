import React from 'react';
import { hot } from 'react-hot-loader/root';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import App from '../components/App';

// We need a Root component for React Hot Loading.
function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default hot(Root);
