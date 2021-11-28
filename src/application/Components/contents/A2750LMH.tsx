import React, { ReactElement, useState } from 'react';
import { Space, Row, Col } from 'antd';
import { usePolling } from '@src/application/hooks/ipcHook';

import MeasureData from '@src/Data/MeasureData';

import LMHInfoContainer from '../lmh/LMHInfoContainer';
import LDHInfoContainer from '../lmh/LDHInfoContainer';
import LMHDIStatus from '../lmh/LMHDIStatus';
import LMHDOStatus from '../lmh/LMHDOStatus';
import LMHDITestMode from '../lmh/LMHDITestMode';
import LMHDOControl from '../lmh/LMHDOControl';
import Title from '../Title';

export default function LMHContents(): ReactElement {
  const [doStatus, setDoData] = useState<MeasureData<boolean>>();
  usePolling(
    {
      requestType: 'LMDOData',
      responseChannel: 'POLL-LM-DO-Data',
      props: { id: 0 },
    },
    (event, resp) => {
      const data = resp as MeasureData<boolean>;
      setDoData(data);
    },
    300,
  );

  return (
    <>
      <Row>
        <Col flex="1 1 auto">
          <Space
            direction="vertical"
            style={{ width: '95%', marginBottom: 30 }}
            size="large"
          >
            <Title> Information </Title>
            <LMHInfoContainer />
            <LDHInfoContainer />
          </Space>
        </Col>
        <Col flex="1 2 160px">
          <Space
            direction="vertical"
            style={{ width: '95%', marginBottom: 30 }}
            size="large"
          >
            <Title> I/O Status </Title>
            <LMHDIStatus />
            <LMHDOStatus doStatus={doStatus} />
          </Space>
        </Col>
        <Col flex="2 0 300px">
          <Space
            direction="vertical"
            style={{ width: '95%', marginBottom: 30 }}
            size="large"
          >
            <Title> I/O Control </Title>
            <LMHDITestMode />
            <LMHDOControl doStatus={doStatus} />
          </Space>
        </Col>
      </Row>
    </>
  );
}
