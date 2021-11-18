import React, { FC } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import ConnectWrapper from './Components/ConnectWrapper';

const { Header, Content, Sider, Footer } = Layout;

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
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
        <Menu.Item key="1">
          <Link to="/">Information</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/Control">Control</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/Setup">Setup</Link>
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      <Header className="site-layout-background" style={{ padding: 0 }} />
      <Content
        style={{ margin: '24px 16px 0', overflow: 'scroll', overflowX: 'auto' }}
      >
        <div
          className="site-layout-background"
          style={{
            padding: 24,
            textAlign: 'left',
            overflowX: 'auto',
            flexWrap: 'wrap',
            width: '100vw',
            height: '100vh',
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  </Layout>
);

export default RouterApp;
