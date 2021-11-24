import React, { ReactElement, useState } from 'react';

import { Card, Space } from 'antd';
import styled from 'styled-components';
import LMDIData from '@src/Data/LMDIData';
import { useInterval, usePolling } from '../hooks/ipcHook';
import IpcService from '@src/main/IPCService';
import { REQ_DATA } from '@src/ipcChannels';
// shift + alt +f
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
  console.log('io status id ', id);
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

  useInterval(() => {
    const inst = IpcService.getInstance();
    inst.sendPolling(REQ_DATA, {
      responseChannel: 'POLL-IO-DI-Data',
      requestType: 'IODIData',
      props: {
        id,
      },
    });

    inst.sendPolling(REQ_DATA, {
      responseChannel: 'POLL-IO-DO-Data',
      requestType: 'IODOData',
      props: {
        id,
      },
    });
  }, 1000);

  const [measureData, setMeasureData] = useState<LMDIData[]>([]);
  const [DOmeasureData, setDOMeasureData] = useState<LMDIData[]>([]);
  usePolling('POLL-IO-DI-Data', (evt, resp) => {
    const data = resp as LMDIData[];
    setMeasureData(data);
  });

  usePolling('POLL-IO-DO-Data', (evt, resp) => {
    const data = resp as LMDIData[];
    setDOMeasureData(data);
  });
  
  return (
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
