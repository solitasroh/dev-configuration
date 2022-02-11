import React from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import IOHContents from '../Components/contents/A2750IOH';
import LMHContents from '../Components/contents/A2750LMH';
import PCContents from '../Components/contents/A2750PC';
import Home from '../Components/contents/Home';
import LogicSetupContents from '../Components/contents/LogicSetup';
import WrappedMapContents from '../Components/contents/WrappedMapSetup';

import RouterApp from '../Components/RouterApp';

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
        <Route path="/" element={<Home />} />
        <Route path="/LMHContents" element={<LMHContents />} />
        <Route path="/IOHContents" element={<IOHContents />} />
        <Route path="/PCContents" element={<PCContents />} />
        <Route path="/WrappedMapContents" element={<WrappedMapContents />} />
        <Route path="/LogicSetupContents" element={<LogicSetupContents />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  </Container>
);

export default MainRouter;
