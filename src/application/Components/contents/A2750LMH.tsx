import React, { ReactElement } from 'react';
import { Collapse, Space } from 'antd';
import LMHInfoContainer from '../lmh/LMHInfoContainer';
import LDHInfoContainer from '../lmh/LDHInfoContainer';
import LMHDIStatus from '../lmh/LMHDIStatus';
import LMHDOStatus from '../lmh/LMHDOStatus';
import LMHDITestMode from '../lmh/LMHDITestMode';
import LMHDOControl from '../lmh/LMHDOControl';

const { Panel } = Collapse;

export default function LMHContents(): ReactElement {
  return (
    <Space align="start" direction="horizontal">
      <Collapse defaultActiveKey={['1']} bordered={false} ghost>
        <Panel header="Information" key="1">
          <Space align="start" style={{ marginRight: 10 }}>
            <LMHInfoContainer partnerInfo={false} />
            <LMHInfoContainer partnerInfo />
          </Space>
          <Space align="start">
            <LDHInfoContainer />
          </Space>
        </Panel>
        <Panel header="IO Status" key="2">
          <Space align="start">
            <LMHDIStatus />
            <LMHDOStatus />
          </Space>
        </Panel>
      </Collapse>
      <Collapse defaultActiveKey={['1']} bordered={false} ghost>
        <Panel header="IO Control" key="1">
          <Space align="start">
            <LMHDITestMode />
            <LMHDOControl />
          </Space>
        </Panel>
      </Collapse>
    </Space>
  );
}
