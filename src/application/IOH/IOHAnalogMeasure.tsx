import React, { ReactElement, useState } from 'react';
import AIMeasure from '@src/Data/AIMeasure';
import styled from 'styled-components';
import { Card, Space } from 'antd';
import { usePolling2 } from '../hooks/ipcHook';

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

  usePolling2(
    {
      requestType: 'AIMeasure',
      responseChannel: 'RES-AI',
      props: { id },
    },
    (evt, resp) => {
      setMeasureData(resp as AIMeasure[]);
    },
    1000,
  );

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
