

import React from 'react';
import { shallow } from 'enzyme';
import App from './';

it('Test example', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.is('div')).toBeTruthy();
});
