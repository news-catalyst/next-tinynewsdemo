import React from 'react';
import { createGlobalStyle } from 'styled-components';
import tw, { theme, GlobalStyles as BaseStyles } from 'twin.macro';

const CustomStyles = createGlobalStyle`
  body {
    -webkit-tap-highlight-color: ${theme`colors.purple.500`};
    ${tw`antialiased`}
  }
  ul.pagination {
    display: inline-flex;
  }
  ul.pagination li {
    padding-top: .5rem;
    padding-bottom: .5rem;
    padding-left: .5rem;
    padding-right: .5rem;
    position: relative;
  }
  ul.pagination li.disabled {
    display: none;
  }
  ul.pagination li.active {
    font-weight: bold;
  }
`;

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;
