import React, { FC } from 'react';
import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import ConnectWrapper from './Components/ConnectWrapper';

const { Header, Content, Sider, Footer } = Layout;

const ContentWrapper = styled(Layout)`
  display: flex;
`;

const Contents = styled(Content)`
  flex: 1;
  flex-wrap: wrap;
  background-color: #ffffff;
  margin: 24px 16px;
  overflow-x: auto;
  overflow-y: auto;
  padding: 16px;
`;

const InforHeaderMenu: FC = () => (
  <Menu theme="light" mode="horizontal">
    <Menu.Item key="1">
      <Link to="/">LMH</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to="/LM">IOH</Link>
    </Menu.Item>
    <Menu.Item key="3">
      <Link to="/PC">PC</Link>
    </Menu.Item>
  </Menu>
);

const RouterApp: FC = () => (
  <Layout>
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
      <ConnectWrapper />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">
          <Link to="/">Information</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/Control">Control</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/Setup">Setup</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/LMHContents">LMH Contents</Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/PCContents">A2750PC Contents</Link>
        </Menu.Item>
      </Menu>
    </Sider>
    <ContentWrapper className="site-layout" style={{ marginLeft: 200 }}>
      <Header className="site-layout-background" style={{ padding: 0 }}>
       <InforHeaderMenu />
      </Header>
      <Contents>
        <Outlet />
      </Contents>
      <Footer style={{ textAlign: 'center' }}>
        Rootech ©2021 Created by S.J
      </Footer>
    </ContentWrapper>
  </Layout>
);

export default RouterApp;
