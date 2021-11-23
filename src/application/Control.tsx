import { Space } from 'antd';
import React from 'react';
import AITestView from './ioh/AITestView';
import IOTestView from './ioh/IOTestView';
import LMTestView from './lmh/LMTestView';

const Control: React.FC = () => (
  <Space direction="vertical">
    <Space align="start" size="middle" direction="vertical">
      <LMTestView />
      <IOTestView />
      <AITestView />
    </Space>
  </Space>
);

export default Control;
