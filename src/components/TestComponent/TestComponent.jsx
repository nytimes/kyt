import React from 'react';
import {useJssSheet} from 'kyt/utils';
/*
 * A demo component
 * This component is built with:
 * React: https://facebook.github.io/react/
 * React-JSS: https://github.com/jsstyles/react-jss
 *
*/
const styles = {
  heading: {
    'background-color': 'salmon'
  }
};
class TestComponent extends React.Component {
  render() {
    var classes = this.props.sheet.classes;
    return ( <h2 className={classes.heading}>This is a test component</h2>);
  }

}

export default useJssSheet(TestComponent, styles);
