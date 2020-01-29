import React from 'react';
import { toolClass } from './styles';

function Tools() {
  return (
    <ul>
      <li className={toolClass}>
        <a href="https://facebook.github.io/react/">React</a> - component library
      </li>
      <li className={toolClass}>
        <a href="https://github.com/reactjs/react-router">React Router</a> - server and browser
        routing
      </li>
      <li className={toolClass}>
        <a href="https://github.com/airbnb/enzyme">Enzyme</a> - React component testing
      </li>
    </ul>
  );
}

export default Tools;
