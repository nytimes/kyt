import React from 'react';
import styles from './demo-styles.css';
/*
 * A demo component using react and css modules
 *
*/
export default class Test extends React.Component {
    render() {
        return(
            <h1 className={styles.demo}>Hello It's Me</h1>
        )
    }
}
