import React, { ReactElement, useState } from 'react';
import { Card, Empty, Space } from 'antd';
import styled from 'styled-components';

import MeasureData from '@src/Data/MeasureData';
import { usePolling } from '@src/application/hooks/ipcHook';

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
  measureDataDI: MeasureData<boolean>;
  measureDataDO: MeasureData<boolean>;
};

export default function IOHDIOStatus({ id, measureDataDI, measureDataDO }: props): ReactElement {

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

  return id === 0 ? (
    <Empty />
  ) : (
    <Card
      title={`IOH -${id} DIO Status`}
      size="small"
      style={{ width: '300px' }}
      type="inner"
    >
      {measureDataDI?.detail.map((measure, index) => (
        <Space size="small" key={measure.channel}>
          <Label>ch {measure.channel}</Label>
          <Value>{setDIState(measure.value)}</Value>
        </Space>
      ))}
      {measureDataDO?.detail.map((measure) => (
        <Space size="small" key={measure.channel}>
          <Label>ch {measure.channel}</Label>
          <Value>{setDOState(measure.value)}</Value>
        </Space>
      ))}
    </Card>
  );
}
