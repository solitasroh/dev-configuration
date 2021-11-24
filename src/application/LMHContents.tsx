import React, { ReactElement } from 'react';
import { Collapse, Space } from 'antd';
import IpcService from '@src/main/IPCService';
import { REQ_DATA } from '@src/ipcChannels';
import { useInterval } from './hooks/ipcHook';
import LMInformationView from './lmh/LMInformationView';
import LDInformationView from './lmh/LDInformationView';
import LMDigitalMeasure from './lmh/LMDigitalMeasure';
import LMDOMeasure from './lmh/LMDOMeasure';
import LMTestView from './lmh/LMTestView';
import LMDOControl from './lmh/LMDOControl';

const { Panel } = Collapse;

export default function LMHContents(): ReactElement {
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
      responseChannel: 'POLL-LM-DI-Data',
      requestType: 'LMDIData',
      props: { id: 0 },
    });

    inst.sendPolling(REQ_DATA, {
      responseChannel: 'POLL-LM-DO-Data',
      requestType: 'LMDOData',
      props: { id: 0 },
    });

    inst.sendPolling(REQ_DATA, {
      responseChannel: 'POLL-MISSMATCH-STATE',
      requestType: 'MissMatchState',
    });
  }, 1000);

  return (
    <Space align="start" direction="horizontal">
      <Collapse defaultActiveKey={['1']} bordered={false} ghost>
        <Panel header="Information" key="1">
          <Space align="start">
            <LMInformationView />
            <LDInformationView />
          </Space>
        </Panel>
        <Panel header="IO Status" key="2">
          <Space align="start">
            <LMDigitalMeasure />
            <LMDOMeasure />
          </Space>
        </Panel>
      </Collapse>
      <Collapse defaultActiveKey={['1']} bordered={false} ghost>
        <Panel header="IO Control" key="1">
          <Space align="start">
            <LMTestView />
            <LMDOControl />
          </Space>
        </Panel>
      </Collapse>
    </Space>
  );
}
