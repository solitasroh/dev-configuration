import React, { ReactElement, useState, useEffect } from 'react';
import AIMeasure from '@src/Data/AIMeasure';
import { REQ_DATA } from '@src/ipcChannels';
import IpcService from '@src/main/IPCService';
import ChannelReadDataProps from '@src/main/ipc/ChannelReadDataProps';
import styled from 'styled-components';
import { Card, Space } from 'antd';

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

interface Props {
  id: number;
}

export default function IOHAnalogMeasure({ id }: Props): ReactElement {
  const [measureData, setMeasureData] = useState<AIMeasure[]>([]);
  useEffect(() => {
    IpcService.getInstance()
      .send<AIMeasure[], ChannelReadDataProps>(REQ_DATA, {
        requestType: 'AIMeasure',
        responseChannel: 'RES-AI',
        props: { id },
      })
      .then((measure) => {
        setMeasureData(measure);
      });

    return () => {
      setMeasureData(null);
    };
  }, []);
  return (
    <Card
      title="AI Status"
      size="small"
      style={{ width: '300px' }}
      type="inner"
    >
      {measureData.map((measure) => (
          <Space size="small" key={measure.ch}>
            <Label>ch {measure.ch}</Label>
            <Value>{measure.data}</Value>
          </Space>
      ))}
    </Card>
  );
}
