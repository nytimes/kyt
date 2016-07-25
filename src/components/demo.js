import React from 'react';
import {useSheet} from '../styleSheet.js';
var styles = {
  demo: {
    'background-color': 'pink',
    'border': '5px dashed black'
  }
};



/*
 * A demo component using react and jss
 *
*/
class Demo extends React.Component {
  render() {
    var classes = this.props.sheet.classes;
    return ( <h1 className={classes.demo}>Hello It's Me</h1>);
  }

}

export default useSheet(Demo, styles);
