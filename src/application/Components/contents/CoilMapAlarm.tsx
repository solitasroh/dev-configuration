import { usePolling } from '@src/application/hooks/ipcHook';
import CoilAlarm from '@src/Data/CoilMapAlarm';
import { Card, List, Space } from 'antd';
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';

const Label = styled.p`
  text-align: left;
  font-size: 8pt;
  width: 130px;
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

export default function CoilMapAlarmContent(): ReactElement {
  const [statusList, setStatusList] = useState<CoilAlarm>(new CoilAlarm());

  usePolling(
    {
      requestType: 'CoilMapAlarm',
      responseChannel: 'POLL-coil-alarm',
    },
    (evt, resp) => {
      const data = resp as CoilAlarm;
      setStatusList(data);
    },
    3000,
  );
  return (
    <div>
      <List.Item>
        <Space align="start">
          <Card size="small" >
            <Space size="middle" direction="vertical">
              <Space size="middle">
                <Label>A2750PC Ring Alarm</Label>
                <Status on={statusList.ringState ?? false} />
              </Space>
              <Space size="middle">
                <Label>Display Disconnect Alarm</Label>
                <Status on={statusList.displayDisconnect ?? false} />
              </Space>
              <Space size="middle">
                <Label>Active Status(A2700M)</Label>
                <Status on={statusList.activeStatus ?? false} />
              </Space>
              <Space size="middle">
                <Label>Ethernet Disconnect Alarm</Label>
                <Status on={statusList.ethernetDisconnect ?? false} />
              </Space>
              <Space size="middle">
                <Label>LMH Mismatch Alarm</Label>
                <Status on={statusList.lmhMismatch ?? false} />
              </Space>
            </Space>
          </Card>
          <Card size="small">
            <Space size="small" direction="vertical">
              <Space size="small">
                <Label>A2750PC Remote State</Label>
                <Status on={statusList.remote ?? false} />
              </Space>
              <Space size="small">
                <Label>A2750PC Abnormal State</Label>
                <Status on={statusList.abnormal ?? false} />
              </Space>
            </Space>
          </Card>
        </Space>
      </List.Item>
    </div>
  );
}
