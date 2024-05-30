import { css } from 'pretty-lights';
import logo from '../../images/icon-kytLogo_large-252x252.svg';
import { padding } from '../../shared-styles/variables';

// eslint-disable-next-line import/prefer-default-export
export const logoClass = css`
  display: block;
  width: 252px;
  height: 252px;
  margin: ${padding}px auto;
  background: url(${logo});
`;
