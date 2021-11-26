import React, { ReactElement } from 'react';
import { Collapse, Space } from 'antd';
import LMInformationView from './lmh/LMInformationView';
import LDInformationView from './lmh/LDInformationView';
import LMDigitalMeasure from './lmh/LMDigitalMeasure';
import LMDOMeasure from './lmh/LMDOMeasure';
import LMTestView from './lmh/LMTestView';
import LMDOControl from './lmh/LMDOControl';

const { Panel } = Collapse;

export default function LMHContents(): ReactElement {
  return (
    <Space align="start" direction="horizontal">
      <Collapse defaultActiveKey={['1']} bordered={false} ghost>
        <Panel header="Information" key="1">
          <Space align="start" style={{marginRight: 10}}>
            <LMInformationView partnerInfo={false} />
            <LMInformationView partnerInfo />
          </Space>
          <Space align="start" >
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
