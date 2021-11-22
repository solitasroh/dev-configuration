import { Space } from 'antd';
import React from 'react';
import LMTestView from './lmh/LMTestView';

const Control: React.FC = () => (
  <Space direction="vertical">
    <Space align="start" size="middle">
      <LMTestView />
    </Space>
  </Space>
);

export default Control;
