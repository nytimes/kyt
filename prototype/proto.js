/**
 * A simple setup for frontend prototypes.
 * Replace your component with TestComponent
 * and npm run kyt:proto
 *
*/
import createProto from 'kyt/utils/proto-setup';
import UserComponent from '../../../prototype.js';
/**
 * The create proto function takes two parameters
 * and creates a single page app to test your prototypes.
 * component: The root component of your prototype
 * props: props for the component Object
 */
createProto(UserComponent);


