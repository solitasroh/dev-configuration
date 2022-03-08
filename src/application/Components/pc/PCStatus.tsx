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
  energized?: boolean;
};
const Status = styled.div<statusProps>`
  width: 15px;
  height: 15px;
  background-color: ${(props) => (props.energized? '#8ad68e' : '#dd5e5e')};
  border-radius: 10px;
`;
interface Props {
  // eslint-disable-next-line react/require-default-props
  id?: number;

  status: PCStatus;
}

export const DefaultView: FC<Props> = ({ id, status }) => (
  <List.Item>
    <Card title={`PC-${id} status`} size="small" type="inner">
      <Space size="small" direction="vertical">
        <Space size="small">
          <Label>Starting block</Label>
          <Status energized={status.startingBlock ?? false} />
        </Space>
        <Space size="small">
          <Label>Motor op state</Label>
          <Status energized={status.motorOperationState ?? false} />
        </Space>
        <Space size="small">
          <Label>Remote mode</Label>
          <Status energized={status.remoteStatus ?? false} />
        </Space>
        <Space size="small">
          <Label>abnormal</Label>
          <Status energized={status.abnormalState ?? false} />
        </Space>
        <Space size="small">
          <Label>alarm</Label>
          <Status energized={status.alarmState ?? false} />
        </Space>
        <Space size="small">
          <Label>fault</Label>
          <Status energized={status.faultState ?? false} />
        </Space>
      </Space>
    </Card>
  </List.Item>
);
export const DIStatusView: FC<Props> = ({ id, status }) => (
  <List.Item>
    <Card title={`PC-${id} DI status`} size="small" type="inner">
      <Space size="small" direction="vertical">
        <Space size="small">
          <Label>DI 1</Label>
          <Status energized={status.di1.toString() === "true"} />
        </Space>
        <Space size="small">
          <Label>DI 2</Label>
          <Status energized={status.di2.toString() === "true"} />
        </Space>
        <Space size="small">
          <Label>DI 3</Label>
          <Status energized={status.di3.toString() === "true"} />
        </Space>
        <Space size="small">
          <Label>DI 4</Label>
          <Status energized={status.di4.toString() === "true"} />
        </Space>
        <Space size="small">
          <Label>DI 5</Label>
          <Status energized={status.di5.toString() === "true"} />
        </Space>
        <Space size="small">
          <Label>DI 6</Label>
          <Status energized={status.di6.toString() === "true"} />
        </Space>
        <Space size="small">
          <Label>DI 7</Label>
          <Status energized={status.di7.toString() === "true"} />
        </Space>
        <Space size="small">
          <Label>DI 8</Label>
          <Status energized={status.di8.toString() === "true"} />
        </Space>
        <Space size="small">
          <Label>DI 9</Label>
          <Status energized={status.di9.toString() === "true"} />
        </Space>
        <Space size="small">
          <Label>DI 10</Label>
          <Status energized={status.di10.toString() === "true"} />
        </Space>
      </Space>
    </Card>
  </List.Item>
);

export const DOStatusView: FC<Props> = ({ id, status }) => (
  <List.Item>
    <Card title={`PC-${id} DI status`} size="small" type="inner">
      <Space size="small" direction="vertical">
        <Space size="small">
          <Label>DO 1</Label>
          <Status energized={status.do1 ?? false} />
        </Space>
        <Space size="small">
          <Label>DO 2</Label>
          <Status energized={status.do2 ?? false} />
        </Space>
        <Space size="small">
          <Label>DO 3</Label>
          <Status energized={status.do3 ?? false} />
        </Space>
        <Space size="small">
          <Label>DO 4</Label>
          <Status energized={status.do4 ?? false} />
        </Space>
      </Space>
    </Card>
  </List.Item>
);

export const ProtectionView: FC<Props> = ({ id, status }) => (
  <List.Item>
    <Card title={`PC-${id} Protection status`} size="small" type="inner">
      <Space size="small" direction="vertical">
        <Space size="small">
          <Label>THR</Label>
          <Status energized={status.thr ?? false} />
        </Space>
        <Space size="small">
          <Label>OCR</Label>
          <Status energized={status.ocr ?? false} />
        </Space>
        <Space size="small">
          <Label>POCR</Label>
          <Status energized={status.pocr ?? false} />
        </Space>
        <Space size="small">
          <Label>PSR</Label>
          <Status energized={status.psr ?? false} />
        </Space>
        <Space size="small">
          <Label>UBCR</Label>
          <Status energized={status.ubcr ?? false} />
        </Space>
        <Space size="small">
          <Label>JAM</Label>
          <Status energized={status.jam ?? false} />
        </Space>
        <Space size="small">
          <Label>LSR</Label>
          <Status energized={status.lsr ?? false} />
        </Space>
        <Space size="small">
          <Label>GR(ZCT)</Label>
          <Status energized={status.grzct ?? false} />
        </Space>
        <Space size="small">
          <Label>GR(CT)</Label>
          <Status energized={status.grct ?? false} />
        </Space>
        <Space size="small">
          <Label>UCR</Label>
          <Status energized={status.ucr ?? false} />
        </Space>
        <Space size="small">
          <Label>MCCB TRIP</Label>
          <Status energized={status.mccbTrip ?? false} />
        </Space>
      </Space>
    </Card>
  </List.Item>
);
