import React from 'react';
import {create} from 'jss';
import reactJss from 'react-jss';
import vendorPrefixer from 'jss-vendor-prefixer';

export let jss = create();
export let useSheet = reactJss(jss);
jss.use(vendorPrefixer());

var styles = {
  demo: {
    'background-color': 'pink',
    'border': '5px dashed black'
  }
};



/*
 * A demo component using react and css modules
 *
*/
class Demo extends React.Component {
  render() {
    var classes = this.props.sheet.classes;
    return ( <h1 className={classes.demo}>Hello It's Me</h1>);
  }

}

export default useSheet(Demo, styles);
