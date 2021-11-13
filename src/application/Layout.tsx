import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navigation from './navigation';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  background-color: #ffffff;
  justify-content: flex-start;
`;

const Layout: React.FC = () => (
  <Container>
    <Navigation />
    <Outlet />
  </Container>
);

export default Layout;
