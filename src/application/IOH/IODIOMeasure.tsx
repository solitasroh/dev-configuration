import React, { ReactElement, useState } from 'react';
import { Card, Empty, Space } from 'antd';
import styled from 'styled-components';
import DigitalChannelData from '@src/Data/DigitalChannelData';
import { usePolling2 } from '../hooks/ipcHook';

const Label = styled.p`
  text-align: left;
  font-size: 8pt;
  min-width: 50px;
  width: 70px;
`;
const Value = styled.p`
  width: 150px;
  text-align: center;
  align-items: center;
  font-weight: 600;
  font-size: 9pt;
  background-color: #f5f5f5;
`;
type props = {
  id: number;
};

export default function IODIOMeasure({ id }: props): ReactElement {
  const [measureData, setMeasureData] = useState<DigitalChannelData[]>([]);
  const [DOmeasureData, setDOMeasureData] = useState<DigitalChannelData[]>([]);

  const setDIState = (Status: boolean): string => {
    if (Status === false) return 'De-Energized';
    if (Status === true) return 'Energized';
    return 'Invaild';
  };

  const setDOState = (Status: boolean): string => {
    if (Status === false) return 'Open';
    if (Status === true) return 'Close';
    return 'Invaild';
  };

  usePolling2(
    {
      responseChannel: 'POLL-IO-DI-Data',
      requestType: 'IODIData',
      props: {
        id,
      },
    },
    (evt, resp) => {
      const data = resp as DigitalChannelData[];
      setMeasureData(data);
    },
    1000,
  );

  usePolling2(
    {
      responseChannel: 'POLL-IO-DO-Data',
      requestType: 'IODOData',
      props: {
        id,
      },
    },
    (evt, resp) => {
      const data = resp as DigitalChannelData[];
      setDOMeasureData(data);
    },
    1000,
  );

  return id === 0 ? (
    <Empty />
  ) : (
    <Card
      title={`IOH -${id} DIO Status`}
      size="small"
      style={{ width: '300px' }}
      type="inner"
    >
      {measureData.map((measure) => (
        <Space size="small" key={measure.channel}>
          <Label>ch {measure.channel}</Label>
          <Value>{setDIState(measure.value)}</Value>
        </Space>
      ))}
      {DOmeasureData.map((measure) => (
        <Space size="small" key={measure.channel}>
          <Label>ch {measure.channel}</Label>
          <Value>{setDOState(measure.value)}</Value>
        </Space>
      ))}
    </Card>
  );
}
