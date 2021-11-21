import { Space } from 'antd';
import React from 'react';
import IOHAnalogMeasure from './ioh/IOHAnalogMeasure';

import IOInformationListView from './ioh/IOInformationListView';
import LDInformationView from './lmh/LDInformationView';
import LMInformationView from './lmh/LMInformationView';
import PCStatusView from './pc/PCStatusView';

const Information: React.FC = () => (
  <Space direction="vertical">
    <Space align="start" size="middle">
      <LMInformationView />
      <LDInformationView />
      <PCStatusView id={1} />
     
    </Space>
    <Space>
      <IOInformationListView />
    </Space>
    <Space>
      <IOHAnalogMeasure id={2}/>
    </Space>
  </Space>
);

export default Information;
