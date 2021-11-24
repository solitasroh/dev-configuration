import React, { ReactElement, useState } from 'react';

import { Card, Space, Switch } from 'antd';
import styled from 'styled-components';
import IpcService from '@src/main/IPCService';
import { WRITE_REQ } from '@src/ipcChannels';
import IOCommand from '@src/Data/IOCommand';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';
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

export default function LMDOControl(): ReactElement {
    const temp = new IOCommand(9);
  const [channelValue, setChannelValue] = useState<IOCommand>(temp);

  const setValue = () => {
    const service = IpcService.getInstance();
    service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
      writeData: channelValue,
      requestType: 'LMCommand',
    });
  };

  const checkTestValue = (ch: number, value: boolean) => {
    const st = channelValue.data.find((cv) => cv.channel === ch);
    st.value = value ? 1 : 0;
    setValue();
  };
  return (
    <Card
      title={`LMH DO Control`}
      size="small"
      type="inner"
    >
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
