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

    const setDIState = (Status: boolean ): string => {
      if (Status === false) return 'De-Energized';
      if (Status === true) return 'Energized';
      return 'Invaild';
    }
    const [measureData, setMeasureData] = useState<LMDIData[]>([]);
    usePolling("POLL-LM-DI-Data", (evt,resp) =>{
      const data = resp as LMDIData[];
      setMeasureData(data); 
    });  // resp 에 니가 요청한 LMDIData가 들어올꺼야(as == 형변환)
    // 1초에 한번 요청할꺼야 (sendPolling으로)될까?ㅇㅇ 될꺼임ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ안돼....
    // 아래 터미널로 들어오네..
    // 뭘로 요청함? 코일?ㅇㅇ 코일번지로...코일번지밖에안되지않아?
    
    return (
      <Card
        title="DI Status"
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
  