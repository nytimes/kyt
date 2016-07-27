import {create} from 'jss';
import reactJss from 'react-jss';
import vendorPrefixer from 'jss-vendor-prefixer';

export let jss = create();
export let useSheet = reactJss(jss);
jss.use(vendorPrefixer());
