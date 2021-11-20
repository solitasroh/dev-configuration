import React from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import Control from './Control';
import Information from './Information';
import RouterApp from './RouterApp';
import Setup from './Setup';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  background-color: #ffffff;
  justify-content: flex-start;
`;

const NoMatch: React.FC = () => (
  <Container>
    <div> no matched page</div>
  </Container>
);

const MainRouter: React.FC = () => (
  <Container>
    <Routes>
      <Route path="/" element={<RouterApp />}>
        <Route path="/" element={<Information />} />
        <Route path="/Control" element={<Control />} />
        <Route path="/Setup" element={<Setup />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  </Container>
);

export default MainRouter;
