import { REQ_DATA } from '@src/ipcChannels';
import IpcService from '@src/main/IPCService';
import { Space } from 'antd';
import React from 'react';
import { useInterval } from './hooks/ipcHook';
import IOHAnalogMeasure from './ioh/IOHAnalogMeasure';

import IOInformationListView from './ioh/IOInformationListView';
import LDInformationView from './lmh/LDInformationView';
import LMDigitalMeasure from './lmh/LMDigitalMeasure';
import LMInformationView from './lmh/LMInformationView';
import PCStatusView from './pc/PCStatusView';

const Information: React.FC = () => {
  useInterval(() => {
    const inst = IpcService.getInstance();
    
    inst.sendPolling(REQ_DATA, {
      responseChannel: "POLL-PC-STATUS",
      requestType: "A2750PCStatus"
    });

    inst.sendPolling(REQ_DATA, {
      responseChannel: "POLL-LM-Information",
      requestType: "A2750LMInformation", 
      props: {
        id: 0,
        data: false,
      },
    });

    inst.sendPolling(REQ_DATA, {
      responseChannel: "POLL-IO-Information",
      requestType: "A2750IOInformation",
      props: { id: 0 },
    })

    inst.sendPolling(REQ_DATA, {
      responseChannel: "POLL-LM-DI-Data",
      requestType: "LMDIData", // 이거는 어따써? 그게 factory 에 등록한 이름
      props: { id: 0 },
    })
  }, 1000);
  
  return (
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
        <IOHAnalogMeasure id={2} />
      </Space>      
      <Space>
        <LMDigitalMeasure />
      </Space>
    </Space>
  );
};

export default Information;
