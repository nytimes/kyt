import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import App from '../components/App';

// We need a Root component for React Hot Loading.
export default function Root() {
  return (
    <BrowserRouter>
      <Route path="/" component={App} />
    </BrowserRouter>
  );
}
