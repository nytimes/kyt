import React from 'react';
import { render } from '@testing-library/react';
import Tools from '.';

it('Test example', () => {
  const { container } = render(<Tools />);

  expect(container.firstChild.tagName.toLowerCase()).toBe('ul');
});
