import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import ConnectWrapper from './ConnectWrapper';
import MissmatchInfo from './lmh/MissmatchInfo';

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

const RouterApp: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        style={{}}
      >
        <ConnectWrapper />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/LMHContents">LMH Contents</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/IOHContents">A2750IOH Contents</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/PCContents">A2750PC Contents</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <ContentWrapper className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <MissmatchInfo />
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
};

export default RouterApp;
