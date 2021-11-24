import React, { ReactElement, useState } from 'react';

import { Card, Space, Switch } from 'antd';
import styled from 'styled-components';
import LMTestModeData from '@src/Data/LMTestModeData';
import IpcService from '@src/main/IPCService';
import { WRITE_REQ } from '@src/ipcChannels';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';

const Label = styled.p`
  text-align: left;
  font-size: 8pt;
  min-width: 50px;
  width: 70px;
`;

export default function LMTestView(): ReactElement {
  const [channelValue] = useState<LMTestModeData>(() => {
    const data = new LMTestModeData();
    data.data = [];
    for (let i = 0; i < 18; i += 1) {
      data.data.push({
        channel: i + 1,
        value: 0,
      });
    }
    return data;
  });

  const setValue = () => {
    const service = IpcService.getInstance();
    service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
      writeData: channelValue,
      requestType: 'LMTestSet',
    });
  };
  const checkTestValue = (ch: number, value: boolean) => {
    const st = channelValue.data.find((cv) => cv.channel === ch);
    st.value = value ? 1 : 0;
    setValue();
  };
  return (
    <Card title="LMH Test Mode" size="small" type="inner">
      {channelValue.data.map((item) => (
        <Space key={item.channel} style={{ margin: '10px' }}>
          <Label>{`channel ${item.channel}`}</Label>
          <Switch
            size="small"
            onChange={(checked: boolean) => {
              checkTestValue(item.channel, checked);
            }}
          />
        </Space>
      ))}
    </Card>
  );
}
