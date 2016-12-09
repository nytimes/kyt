

import React from 'react';
import { shallow } from 'enzyme';
import Home from './';

it('Test example', () => {
  const wrapper = shallow(<Home />);
  expect(wrapper.is('section')).toBeTruthy();
});
