
import jss from 'jss';
import camelCase from 'jss-camel-case'

jss.use(camelCase());

export default (styles, options) => jss.createStyleSheet(styles, options).attach().classes;
