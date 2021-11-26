import React, { ReactElement, useState } from 'react';
import { Collapse, Pagination, Space } from 'antd';

import IOHInfoData from '@src/Data/IOHInfoData';
import { usePolling } from '@src/application/hooks/ipcHook';

import IOHInfoContainer from '../ioh/IOHInfoContainer';
import IOHDOControl from '../ioh/IOHDOControl';
import IOHDIOStatus from '../ioh/IOHDIOStatus';
import IOHAIStatus from '../ioh/IOHAIStatus';
import IOHAITestMode from '../ioh/IOHAITestMode';
import IOHDITestMode from '../ioh/IOHDITestMode';

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
  const [information, setInformation] = useState<IOHInfoData[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const onChange = (page: number, pageSize: number) => {
    // ��û�ϴ� ID�� �޶����� �ȴ�.
    const info = information[page - 1];
    const typeTmp = getModuleType(info.moduleType);

    setId(info.id);
    setIndex(page);
    setType(typeTmp);
  };

  usePolling(
    {
      responseChannel: 'POLL-IO-information',
      requestType: 'A2750IOInformation',
      props: { id: 0 },
    },
    (evt, rest) => {
      const infoList = rest as IOHInfoData[];
      const validIO = infoList.filter(
        (data) => data.operationStatus === 'OPERATING',
      );
      setInformation(validIO);
      setTotalCount(validIO.length);
    },
    1000,
  );

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
              <IOHInfoContainer information={information[index - 1]} />
            </Space>
          </Panel>
          <Panel header="IO Status" key="2">
            <Space align="start">
              {type === 5 ? <IOHDIOStatus id={id} /> : <IOHAIStatus id={id} />}
            </Space>
          </Panel>
        </Collapse>
        <Collapse defaultActiveKey={['1']} bordered={false} ghost>
          <Panel header="IO Control" key="1">
            <Space align="start">
              {type === 5 ? (
                <>
                  <IOHDOControl id={id} />
                  <IOHDITestMode id={id} />
                </>
              ) : (
                <IOHAITestMode id={id} />
              )}
            </Space>
          </Panel>
        </Collapse>
      </Space>
    </Space>
  );
}
