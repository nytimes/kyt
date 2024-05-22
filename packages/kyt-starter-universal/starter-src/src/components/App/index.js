import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import dynamic from 'kyt-runtime/dynamic';
import styled from './styles.module.scss';
import * as styles from './styled';

export const Home = dynamic(() => import(/* webpackChunkName: "home" */ '../Home'));
export const Tools = dynamic(() => import(/* webpackChunkName: "tools" */ '../Tools'));

function App() {
  return (
    <div>
      <i className={styles.logoClass} />
      <ul className={styled.navClass}>
        <li className={styled.navItemClass}>
          <Link className={styled.linkClass} to="/">
            Home
          </Link>
        </li>
        <li className={styled.navItemClass}>
          <Link className={styled.linkClass} to="/tools">
            Tools
          </Link>
        </li>
      </ul>
      <div className={styled.contentClass}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/tools" component={Tools} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
