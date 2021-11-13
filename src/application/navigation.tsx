import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

type NaviItemProps = {
  current?: boolean;
};

const Container = styled.div`
  width: 250px;
  min-width: 200px;
  flex-direction: column;
  padding: 10px;
  height: auto;
  overflow-y: auto;
  background-color: #ffffff;
  border-right: 0.5px solid #dadada;
`;

const NaviItem = styled.li<NaviItemProps>`
  width: 100%;
  line-height: 26px;
  font-size: 10px;
  color: ${(props) => (props.current ? '#ffffff' : '#101010')};
  background-color: ${(props) => (props.current ? '#9bc1c4' : '#ffffff')};
  padding-left: 10px;
  box-sizing: border-box;
  transition: 0.2s;
  border-radius: 3px;
  font-weight: ${(props) => (props.current ? '600' : '400')};
`;
const NaviLink = styled(Link)`
  font-size: 12px;
`;

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <Container>
      <NaviItem current={location.pathname === '/'}>
        <NaviLink to="/">Information</NaviLink>
      </NaviItem>
      <NaviItem current={location.pathname === '/Control'}>
        <NaviLink to="/Control">Control</NaviLink>
      </NaviItem>
      <NaviItem current={location.pathname === '/Setup'}>
        <NaviLink to="/Setup">Setup</NaviLink>
      </NaviItem>
    </Container>
  );
};

export default Navigation;
