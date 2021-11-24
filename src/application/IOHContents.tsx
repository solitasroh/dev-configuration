import React, { ReactElement, useState } from 'react';
import { Collapse, Pagination, Space } from 'antd';
import IpcService from '@src/main/IPCService';
import { REQ_DATA } from '@src/ipcChannels';
import IOInformation from '@src/Data/A2700.IOInformation';
import { useInterval, usePolling } from './hooks/ipcHook';
import IOHInformationView from './ioh/IOHInformationView';
import IODOControl from './ioh/IODOControl';
import IODIOMeasure from './ioh/IODIOMeasure';
import IOHAnalogMeasure from './ioh/IOHAnalogMeasure';
import AITestView from './ioh/AITestView';
import IOTestView from './ioh/IOTestView';

const { Panel } = Collapse;

function getModuleType(moduleType: string): number {
  if (moduleType === 'DIO') return 5;
  if (moduleType === 'AI2') return 8;
  return 0;
}

export default function IOHContents(): ReactElement {
  const [index, setIndex] = useState(0);
  const [id, setId] = useState(0);
  const [type, setType] = useState(5);
  const [information, setInformation] = useState<IOInformation[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const onChange = (page: number, pageSize: number) => {
    // 요청하는 ID만 달라지면 된다.
    const info = information[page - 1];
    const typeTmp = getModuleType(info.moduleType);

    setId(info.id);
    setIndex(page);
    setType(typeTmp);
  };

  useInterval(() => {
    const inst = IpcService.getInstance();

    inst.sendPolling(REQ_DATA, {
      responseChannel: 'POLL-IO-information',
      requestType: 'A2750IOInformation',
      props: { id: 0 },
    });

    inst.sendPolling(REQ_DATA, {
      responseChannel: 'POLL-MISSMATCH-STATE',
      requestType: 'MissMatchState',
    });
  }, 1000);

  usePolling('POLL-IO-information', (evt, rest) => {
    const infoList = rest as IOInformation[];
    const validIO = infoList.filter(
      (data) => data.operationStatus === 'OPERATING',
    );
    setInformation(validIO);
    setTotalCount(validIO.length);
  });

  return (
    <Space direction="vertical">
      .
      <Pagination
        defaultCurrent={1}
        total={totalCount}
        size="small"
        defaultPageSize={1}
        showQuickJumper
        onChange={onChange}
      />
      <Space align="start" direction="horizontal">
        <Collapse defaultActiveKey={['1']} bordered={false} ghost>
          <Panel header="Information" key="1">
            <Space align="start">
              <IOHInformationView information={information[index - 1]} />
            </Space>
          </Panel>
          <Panel header="IO Status" key="2">
            <Space align="start">
              {type === 5 ? (
                <IODIOMeasure id={id} />
              ) : (
                <IOHAnalogMeasure id={id} />
              )}
            </Space>
          </Panel>
        </Collapse>
        <Collapse defaultActiveKey={['1']} bordered={false} ghost>
          <Panel header="IO Control" key="1">
            <Space align="start">
              {type === 5 ? (
                <>
                  <IODOControl id={id} />
                  <IOTestView id={id} />
                </>
              ) : (
                <AITestView id={id} />
              )}
            </Space>
          </Panel>
        </Collapse>
      </Space>
    </Space>
  );
}
