import React, { ReactElement, useState } from 'react';

import { Card, Space, Input, Button } from 'antd';
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
type props = { id:number }
export default function AITestView({id}:props): ReactElement {
  const tmp = new LMTestModeData(12);
  const [channelValue] = useState(tmp);
  

  const setValue = () => {
    const service = IpcService.getInstance();
    channelValue.id = id;
    service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
      writeData: channelValue,
      requestType: 'IOAiTest',
    });
  };

  const checkTestValue = (ch: number, value: string) => {
    const st = channelValue.data.find((cv) => cv.channel === ch);
    const num = parseInt(value, 10);
    st.value = num;
  };

  return (
    <Card title="IOH AI Test Mode" size="small" type="inner" extra={ <Button onClick={() => setValue()} > Apply</Button>}>
      <div>
        {channelValue.data.map((item) => (
          <Space key={item.channel} style={{ margin: '10px' }}>
            <Label>{`channel ${item.channel}`}</Label>
            <Input
              size="small"
              onChange={(e) => {
                checkTestValue(item.channel, e.target.value);
              }}
            />
          </Space>
        ))}
      </div>
    </Card>
  );
}
