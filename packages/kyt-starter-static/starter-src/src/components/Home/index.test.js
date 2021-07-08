import React from 'react';
import { render } from '@testing-library/react';
import Home from '.';

it('Test example', () => {
  const { container } = render(<Home />);

  expect(container.firstChild.tagName.toLowerCase()).toBe('section');
});
