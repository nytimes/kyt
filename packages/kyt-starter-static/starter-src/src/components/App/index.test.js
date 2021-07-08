import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from '.';

it('App', () => {
  const { container } = render(
    <StaticRouter location="/foo">
      <App />
    </StaticRouter>
  );

  expect(container.firstChild.tagName.toLowerCase()).toBe('div');
});
