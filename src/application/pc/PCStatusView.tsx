import React, { FC, useState } from 'react';
import styled from 'styled-components';
import A2750PCStatus from '@src/Data/A2750PCStatus';

import { Card, Space } from 'antd';
import { usePolling } from '../hooks/ipcHook';

const Label = styled.p`
  width: 110px;
  text-align: left;
  font-size: 8pt;
`;

const Value = styled.p`
  width: 150px;
  text-align: center;
  align-items: center;
  font-weight: 600;
  font-size: 9pt;
  background-color: #f5f5f5;
`;

const PCStatusView: FC<{ id: number }> = ({ id }) => {

  const tmpStatus = new A2750PCStatus();
  const [status, setStatus] = useState<A2750PCStatus>(tmpStatus);
  
  usePolling("POLL-PC-STATUS", (evt,resp) => {
    const data = resp as A2750PCStatus;
    setStatus(data);
  });

  return (
    <Card
      title="PC Status"
      size="small"
      style={{ width: '300px' }}
      type="inner"
    >
      <div>
        <Space size="small">
          <Label>Starting block</Label>
          <Value>{status.startingBlock ? "on": "off"}</Value>
        </Space>
        <Space size="small">
          <Label>Motor op state</Label>
          <Value>{status.motorOperationState ? "on": "off"}</Value>
        </Space>
        <Space size="small">
          <Label>Remote mode</Label>
          <Value>{status.remoteStatus ? "on": "off"}</Value>
        </Space>
        <Space size="small">
          <Label>abnormal</Label>
          <Value>{status.abnormalState ? "on": "off"}</Value>
        </Space>
        <Space size="small">
          <Label>alarm</Label>
          <Value>{status.alarmState ? "on": "off"}</Value>
        </Space>
        <Space size="small">
          <Label>fault</Label>
          <Value>{status.faultState ? "on": "off"}</Value>
        </Space>
      </div>
    </Card>
  );
};

export default PCStatusView;
