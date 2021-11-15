import React, { FunctionComponent } from 'react';
import { HashRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import MainRouter from './MainRouter';

const GlobalStyle = createGlobalStyle`
  ${reset}
  /* other styles */
  * {
    box-sizing: border-box;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    :focus {
      outline: none;
    }
  }     
  a {
      text-decoration: none;
      color: inherit;
  };
  body {
    background-color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
  }
  ol, ul, li {
    list-style: none;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const App: FunctionComponent = () => (
  <>
    <GlobalStyle />
    <HashRouter>
      <MainRouter />
    </HashRouter>
  </>
);

export default App;
