import { Space } from 'antd';
import React from 'react';
import styled from 'styled-components';
import IOHInformationView from './IOH/IOHInformationView';
import LDInformationView from './lmh/LDInformationView';
import LMInformationView from './lmh/LMInformationView';

const Contents = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  width: 100%;
  height: 100%;
`;

const Information: React.FC = () => (
  <Space align="start" size="middle">
    <LMInformationView />
    <LDInformationView />
    <IOHInformationView />
  </Space>
);

export default Information;
