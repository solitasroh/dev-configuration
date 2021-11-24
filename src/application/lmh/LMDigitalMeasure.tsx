import React, { ReactElement, useState } from 'react';

import { Card, Space,  } from 'antd';
import styled from 'styled-components';
import DigitalChannelData from '@src/Data/DigitalChannelData';
import { usePolling2 } from '../hooks/ipcHook';
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

  export default function LMDigitalMeasure(): ReactElement {

    const setDIState = (Status: boolean ): string => {
      if (Status === false) return 'De-Energized';
      if (Status === true) return 'Energized';
      return 'Invaild';
    }
    const [measureData, setMeasureData] = useState<DigitalChannelData[]>([]);
 
    usePolling2(
      {
        requestType: 'LMDIData',
        responseChannel: 'POLL-LM-DI-Data',
        props: { id: 0 },
      },
      (event, resp) => {
        const data = resp as DigitalChannelData[];
        setMeasureData(data); 
      },
      1000,
    );
    
    return (
      <Card
        title="LM DI Status"
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
      </Card>
    );
  }
  