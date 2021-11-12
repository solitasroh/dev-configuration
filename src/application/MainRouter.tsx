import React, { FC } from 'react';
import { HashRouter } from 'react-router-dom';
import styled from 'styled-components';
import LDInformationView from './lmh/LDInformationView';
import LMInformationView from './lmh/LMInformationView';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  overflow-y: auto;
  height: 100%;
  flex-wrap: wrap;
  padding: 0px;
`;

const Navigation = styled.div`
  display: flex;
  background-color: #a1a1a1;
  flex-direction: column;
  padding: 10px;
  margin: 0px
`;

const MainRouter: FC = () => (
  <HashRouter>
    <Container>
      <Navigation id="navigation">
        <div>information</div>
        <div>measure</div>
        <div>setup</div>
      </Navigation>

      <div id="contents">
        <LMInformationView />
        <LDInformationView />
      </div>
    </Container>
  </HashRouter>
);

export default MainRouter;
