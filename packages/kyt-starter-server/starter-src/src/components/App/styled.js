import { css } from 'pretty-lights';
import logo from '../../images/icon-kytLogo_large-252x252.svg';
import { contentWidth, padding } from '../../shared-styles/variables';

export const headerClass = css`
  text-align: center;
`;

export const navClass = css`
  width: ${contentWidth}px;
  margin: 0 auto;
  padding: ${padding}px;
  text-align: center;
`;

export const contentClass = css`
  width: ${contentWidth}px;
  margin: ${padding}px auto;
`;

export const navItemClass = css`
  display: inline-block;
`;

export const linkClass = css`
  padding: ${padding}px;
  color: #00a68f;
  font-size: 18px;
`;

export const logoClass = css`
  display: block;
  width: 252px;
  height: 252px;
  margin: ${padding}px auto;
  background: url(${logo});
`;
