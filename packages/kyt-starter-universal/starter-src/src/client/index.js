import React from 'react';
import { hydrate } from 'react-dom';
import Root from './Root';

const root = document.querySelector('#root');

hydrate(<Root />, root);
