import { Space, List } from 'antd';
import React from 'react';
import IOHInformationView from './ioh/IOHInformationView';
import LDInformationView from './lmh/LDInformationView';
import LMInformationView from './lmh/LMInformationView';
import PCStatusView from './pc/PCStatusView';

const Information: React.FC = () => (
  <Space align="start" size="middle">
    <LMInformationView />
    <LDInformationView />
   
    <IOHInformationView id={1}/>
    <PCStatusView id={1}/>
  </Space>
);

export default Information;
