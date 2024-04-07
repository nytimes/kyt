import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import dynamic from 'kyt-runtime/dynamic';
import modules from './styles.module.scss';
import * as styles from './styled';

export const Home = dynamic(() => import(/* webpackChunkName: "home" */ '../Home'));
export const Tools = dynamic(() => import(/* webpackChunkName: "tools" */ '../Tools'));

function App() {
  return (
    <div>
      <i className={styles.logoClass} />
      <ul className={modules.navClass}>
        <li className={modules.navItemClass}>
          <Link className={modules.linkClass} to="/">
            Home
          </Link>
        </li>
        <li className={modules.navItemClass}>
          <Link className={modules.linkClass} to="/tools">
            Tools
          </Link>
        </li>
      </ul>
      <div className={modules.contentClass}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/tools" component={Tools} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
