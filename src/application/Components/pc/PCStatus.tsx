/* eslint-disable no-nested-ternary */
import React, { FC } from 'react';
import styled from 'styled-components';
import PCStatus from '@src/Data/PCStatus';
import { Card, List, Space } from 'antd';

const Label = styled.p`
  text-align: left;
  font-size: 8pt;
  width: 100px;
`;

type statusProps = {
  on: boolean;
};
const Status = styled.div<statusProps>`
  width: 15px;
  height: 15px;
  background-color: ${(props) => (props.on ? '#8ad68e' : '#dd5e5e')};
  border-radius: 10px;
`;
interface Props {
  // eslint-disable-next-line react/require-default-props
  id?: number;

  status: PCStatus;
}

export const DefaultView: FC<Props> = ({ id, status }) => (
  <List.Item>
    <Card title={`PC-${status.id} status`} size="small" type="inner">
      <Space size="small" direction="vertical">
        <Space size="small">
          <Label>Starting block</Label>
          <Status on={status.startingBlock ?? false} />
        </Space>
        <Space size="small">
          <Label>Motor op state</Label>
          <Status on={status.motorOperationState ?? false} />
        </Space>
        <Space size="small">
          <Label>Remote mode</Label>
          <Status on={status.remoteStatus ?? false} />
        </Space>
        <Space size="small">
          <Label>abnormal</Label>
          <Status on={status.abnormalState ?? false} />
        </Space>
        <Space size="small">
          <Label>alarm</Label>
          <Status on={status.alarmState ?? false} />
        </Space>
        <Space size="small">
          <Label>fault</Label>
          <Status on={status.faultState ?? false} />
        </Space>
      </Space>
    </Card>
  </List.Item>
);
export const DIStatusView: FC<Props> = ({ id, status }) => (
  <List.Item>
    <Card title={`PC-${status.id} DI status`} size="small" type="inner">
      <Space size="small" direction="vertical">
        <Space size="small">
          <Label>DI 1</Label>
          <Status on={status.di1 ?? false} />
        </Space>
        <Space size="small">
          <Label>DI 2</Label>
          <Status on={status.di2 ?? false} />
        </Space>
        <Space size="small">
          <Label>DI 3</Label>
          <Status on={status.di3 ?? false} />
        </Space>
        <Space size="small">
          <Label>DI 4</Label>
          <Status on={status.di4 ?? false} />
        </Space>
        <Space size="small">
          <Label>DI 5</Label>
          <Status on={status.di5 ?? false} />
        </Space>
        <Space size="small">
          <Label>DI 6</Label>
          <Status on={status.di6 ?? false} />
        </Space>
        <Space size="small">
          <Label>DI 7</Label>
          <Status on={status.di7 ?? false} />
        </Space>
        <Space size="small">
          <Label>DI 8</Label>
          <Status on={status.di8 ?? false} />
        </Space>
        <Space size="small">
          <Label>DI 9</Label>
          <Status on={status.di9 ?? false} />
        </Space>
        <Space size="small">
          <Label>DI 10</Label>
          <Status on={status.di10 ?? false} />
        </Space>
      </Space>
    </Card>
  </List.Item>
);

export const DOStatusView: FC<Props> = ({ id, status }) => (
  <List.Item>
    <Card title={`PC-${status.id} DI status`} size="small" type="inner">
      <Space size="small" direction="vertical">
        <Space size="small">
          <Label>DO 1</Label>
          <Status on={status.do1 ?? false} />
        </Space>
        <Space size="small">
          <Label>DO 2</Label>
          <Status on={status.do2 ?? false} />
        </Space>
        <Space size="small">
          <Label>DO 3</Label>
          <Status on={status.do3 ?? false} />
        </Space>
        <Space size="small">
          <Label>DO 4</Label>
          <Status on={status.do4 ?? false} />
        </Space>
      </Space>
    </Card>
  </List.Item>
);

export const ProtectionView: FC<Props> = ({ id, status }) => (
  <List.Item>
    <Card title={`PC-${status.id} Protection status`} size="small" type="inner">
      <Space size="small" direction="vertical">
        <Space size="small">
          <Label>THR</Label>
          <Status on={status.thr ?? false} />
        </Space>
        <Space size="small">
          <Label>OCR</Label>
          <Status on={status.ocr ?? false} />
        </Space>
        <Space size="small">
          <Label>POCR</Label>
          <Status on={status.pocr ?? false} />
        </Space>
        <Space size="small">
          <Label>PSR</Label>
          <Status on={status.psr ?? false} />
        </Space>
        <Space size="small">
          <Label>UBCR</Label>
          <Status on={status.ubcr ?? false} />
        </Space>
        <Space size="small">
          <Label>JAM</Label>
          <Status on={status.jam ?? false} />
        </Space>
        <Space size="small">
          <Label>LSR</Label>
          <Status on={status.lsr ?? false} />
        </Space>
        <Space size="small">
          <Label>GR(ZCT)</Label>
          <Status on={status.grzct ?? false} />
        </Space>
        <Space size="small">
          <Label>GR(CT)</Label>
          <Status on={status.grct ?? false} />
        </Space>
        <Space size="small">
          <Label>UCR</Label>
          <Status on={status.ucr ?? false} />
        </Space>
        <Space size="small">
          <Label>MCCB TRIP</Label>
          <Status on={status.mccbTrip ?? false} />
        </Space>
      </Space>
    </Card>
  </List.Item>
);
