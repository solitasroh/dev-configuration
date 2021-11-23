/* eslint-disable no-nested-ternary */
import React, { FC, useState } from 'react';
import styled from 'styled-components';
import A2750PCStatus from '@src/Data/A2750PCStatus';

import { Card, List, Select, Space } from 'antd';
import { usePolling } from '../hooks/ipcHook';

const { Option } = Select;

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
type Props = {
  status: A2750PCStatus;
};

const DefaultView: FC<Props> = ({ status }) => (
  <List.Item>
    <Card title={`PC-${status.id} status`} size="small" type="inner">
      <Space size="small" direction="vertical">
        <Space size="small">
          <Label>Starting block</Label>
          <Status on={status.startingBlock} />
        </Space>
        <Space size="small">
          <Label>Motor op state</Label>
          <Status on={status.motorOperationState} />
        </Space>
        <Space size="small">
          <Label>Remote mode</Label>
          <Status on={status.remoteStatus} />
        </Space>
        <Space size="small">
          <Label>abnormal</Label>
          <Status on={status.abnormalState} />
        </Space>
        <Space size="small">
          <Label>alarm</Label>
          <Status on={status.alarmState} />
        </Space>
        <Space size="small">
          <Label>fault</Label>
          <Status on={status.faultState} />
        </Space>
      </Space>
    </Card>
  </List.Item>
);
const DIStatusView: FC<Props> = ({ status }) => (
  <List.Item>
    <Card title={`PC-${status.id} DI status`} size="small" type="inner">
      <Space size="small" direction="vertical">
        <Space size="small">
          <Label>DI 1</Label>
          <Status on={status.di1} />
        </Space>
        <Space size="small">
          <Label>DI 2</Label>
          <Status on={status.di2} />
        </Space>
        <Space size="small">
          <Label>DI 3</Label>
          <Status on={status.di3} />
        </Space>
        <Space size="small">
          <Label>DI 4</Label>
          <Status on={status.di4} />
        </Space>
        <Space size="small">
          <Label>DI 5</Label>
          <Status on={status.di5} />
        </Space>
        <Space size="small">
          <Label>DI 6</Label>
          <Status on={status.di6} />
        </Space>
        <Space size="small">
          <Label>DI 7</Label>
          <Status on={status.di7} />
        </Space>
        <Space size="small">
          <Label>DI 8</Label>
          <Status on={status.di8} />
        </Space>
        <Space size="small">
          <Label>DI 9</Label>
          <Status on={status.di9} />
        </Space>
        <Space size="small">
          <Label>DI 10</Label>
          <Status on={status.di10} />
        </Space>
      </Space>
    </Card>
  </List.Item>
);
const DOStatusView: FC<Props> = ({ status }) => (
  <List.Item>
    <Card title={`PC-${status.id} DI status`} size="small" type="inner">
      <Space size="small" direction="vertical">
        <Space size="small">
          <Label>DO 1</Label>
          <Status on={status.do1} />
        </Space>
        <Space size="small">
          <Label>DO 2</Label>
          <Status on={status.do2} />
        </Space>
        <Space size="small">
          <Label>DO 3</Label>
          <Status on={status.do3} />
        </Space>
        <Space size="small">
          <Label>DO 4</Label>
          <Status on={status.do4} />
        </Space>
      </Space>
    </Card>
  </List.Item>
);
const ProtectionView: FC<Props> = ({ status }) => (
  <List.Item>
    <Card title={`PC-${status.id} Protection status`} size="small" type="inner">
      <Space size="small" direction="vertical">
        <Space size="small">
          <Label>THR</Label>
          <Status on={status.thr} />
        </Space>
        <Space size="small">
          <Label>OCR</Label>
          <Status on={status.ocr} />
        </Space>
        <Space size="small">
          <Label>POCR</Label>
          <Status on={status.pocr} />
        </Space>
        <Space size="small">
          <Label>PSR</Label>
          <Status on={status.psr} />
        </Space>
        <Space size="small">
          <Label>UBCR</Label>
          <Status on={status.ubcr} />
        </Space>
        <Space size="small">
          <Label>JAM</Label>
          <Status on={status.jam} />
        </Space>
        <Space size="small">
          <Label>LSR</Label>
          <Status on={status.lsr} />
        </Space>
        <Space size="small">
          <Label>GR(ZCT)</Label>
          <Status on={status.grzct} />
        </Space>
        <Space size="small">
          <Label>GR(CT)</Label>
          <Status on={status.grct} />
        </Space>
        <Space size="small">
          <Label>UCR</Label>
          <Status on={status.ucr} />
        </Space>
        <Space size="small">
          <Label>MCCB TRIP</Label>
          <Status on={status.mccbTrip} />
        </Space>
      </Space>
    </Card>
  </List.Item>
);

const PCStatusView: FC<{ id: number }> = ({ id }) => {
  const [statusType, setStatusType] = useState(1);
  const [statusList, setStatus] = useState<A2750PCStatus[]>([]);

  usePolling('POLL-PC-STATUS', (evt, resp) => {
    const data = resp as A2750PCStatus[];
    setStatus(data);
  });
  return (
    <Space direction="vertical">
      <Space>
        <Label>Status Type</Label>
        <Select defaultValue={1} onChange={(value) => setStatusType(value)} style={{width: 120}}>
          <Option value={1}>Default</Option>
          <Option value={2}>DI</Option>
          <Option value={3}>DO</Option>
          <Option value={4}>Protection</Option>
        </Select>
      </Space>
      <List
        grid={{
          gutter: 16,
          xs: 3,
          sm: 3,
          md: 5,
          lg: 6,
          xl: 6,
          xxl: 10,
        }}
        dataSource={statusList}
        renderItem={(status) =>
          statusType === 1 ? (
            <DefaultView status={status} />
          ) : statusType === 2 ? (
            <DIStatusView status={status} />
          ) : statusType === 3 ? (
            <DOStatusView status={status} />
          ) : (
            <ProtectionView status={status} />
          )
        }
      />
    </Space>
  );
};

export default PCStatusView;
