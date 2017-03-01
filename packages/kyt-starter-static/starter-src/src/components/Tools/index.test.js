

import React from 'react';
import { shallow } from 'enzyme';
import Tools from './';

it('Test example', () => {
  const wrapper = shallow(<Tools />);
  expect(wrapper.is('ul')).toBeTruthy();
});
