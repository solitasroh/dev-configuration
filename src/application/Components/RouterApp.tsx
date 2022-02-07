import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
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
  const [selectedKey, setSelectKey] = useState('1');
  const navigate = useNavigate();
  useEffect(() => {
    if (selectedKey === '1') {
      navigate('/LMHContents');
    }
  }, [selectedKey]);

  const onCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const mainMenuHandleClick = (e: { key: string }) => {
    setSelectKey(e.key);
  };

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        style={{}}
      >
        <ConnectWrapper />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['0']}
          selectedKeys={[selectedKey]}
          onClick={mainMenuHandleClick}
        >
          <Menu.Item key="0">
            <NavLink to="/">Home</NavLink>
          </Menu.Item>
          <Menu.Item key="1">
            <NavLink to="/LMHContents">A2750LMH</NavLink>
          </Menu.Item>
          <Menu.Item key="2">
            <NavLink to="/IOHContents">A2750IOH</NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to="/PCContents">A2750PC</NavLink>
          </Menu.Item>
          <Menu.Item key="4">
            <NavLink to="/WrappedMapContents">WrappedElement</NavLink>
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
          Rootech ©2021 Created by S.J N.H
        </Footer>
      </ContentWrapper>
    </Layout>
  );
};

export default RouterApp;
