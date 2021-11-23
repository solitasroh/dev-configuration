import React, { ReactElement, useState } from 'react';

import { Card, Space,  } from 'antd';
import styled from 'styled-components';
import LMDIData from '@src/Data/LMDIData';
import { usePolling } from '../hooks/ipcHook';
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

    const setDOState = (Status: boolean ): string => {
      if (Status === false) return 'Open';
      if (Status === true) return 'Close';
      return 'Invaild';
    }
    const [measureData, setMeasureData] = useState<LMDIData[]>([]);
    usePolling("POLL-LM-DO-Data", (evt,resp) =>{
      const data = resp as LMDIData[];
      setMeasureData(data); 
      
    }); 
    
    return (
      <Card
        title="LM DO Status"
        size="small"
        style={{ width: '300px' }}
        type="inner"
      >
        {measureData.map((measure) => (
            <Space size="small" key={measure.channel}>
              <Label>ch {measure.channel}</Label>
              <Value>{setDOState(measure.value)}</Value>
            </Space>
        ))}
      </Card>
    );
  }
  