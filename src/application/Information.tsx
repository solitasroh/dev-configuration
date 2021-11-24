import { REQ_DATA } from '@src/ipcChannels';
import IpcService from '@src/main/IPCService';
import { Space } from 'antd';
import React from 'react';
import { useInterval } from './hooks/ipcHook';
import IOHAnalogMeasure from './ioh/IOHAnalogMeasure';

import IOInformationListView from './ioh/IOInformationListView';
import LDInformationView from './lmh/LDInformationView';
import LMDigitalMeasure from './lmh/LMDigitalMeasure';
import LMDOControl from './lmh/LMDOControl';
import LMDOMeasure from './lmh/LMDOMeasure';
import LMInformationView from './lmh/LMInformationView';
import MissmatchInfo from './lmh/MissmatchInfo';

const Information: React.FC = () => {
  useInterval(() => {
    const inst = IpcService.getInstance();

    inst.sendPolling(REQ_DATA, {
      responseChannel: 'POLL-PC-STATUS',
      requestType: 'A2750PCStatus',
    });

    inst.sendPolling(REQ_DATA, {
      responseChannel: 'POLL-LM-Information',
      requestType: 'A2750LMInformation',
      props: {
        id: 0,
        data: false,
      },
    });

    inst.sendPolling(REQ_DATA, {
      responseChannel: 'POLL-IO-Information',
      requestType: 'A2750IOInformation',
      props: { id: 0 },
    });

    inst.sendPolling(REQ_DATA, {
      responseChannel: "POLL-LM-DI-Data",
      requestType: "LMDIData", 
      props: { id: 0 },
    });

    inst.sendPolling(REQ_DATA, {
      responseChannel: "POLL-LM-DO-Data",
      requestType: "LMDOData", 
      props: { id: 0 },
    });

    inst.sendPolling(REQ_DATA, {
      responseChannel: 'POLL-MISSMATCH-STATE',
      requestType: 'MissMatchState',
    });
  }, 1000);

  return (
    <Space direction="vertical">
      <MissmatchInfo/>
      <Space align="start" size="middle">
        <LMInformationView />
        <LDInformationView />
       
      </Space>
      <Space>
        <IOInformationListView />
      </Space>
      <Space>
        <IOHAnalogMeasure id={2} />
      </Space>      
      <Space  align="start">
        <LMDigitalMeasure />
        <LMDOMeasure />
      </Space>     
      <Space>
        <LMDOControl />
      </Space>
      <Space>
        {/* <PCStatusView id={1} /> */}
      </Space>
    </Space>
  );
};

export default Information;
