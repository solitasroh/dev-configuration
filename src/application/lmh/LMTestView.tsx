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
`;
export default function LMTestView(): ReactElement {
  const [channelValue, setChannelValue] = useState<LMTestModeData>(() => {
    const data = new LMTestModeData();
    data.data = [];
    for(let i=0;i<18;i+=1) {
        data.data.push({
            channel: i+1,
            value: 0,
        })
    }

    return data;
  });

  const setValue = () => {
      const service = IpcService.getInstance();
      service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
        writeData: channelValue,
        requestType: "LMTestSet"
      });
  }

  return (
    <Card
      title="LMH Test Mode"
      size="small"
      type="inner"
    >
      {channelValue.data.map((item) => (
        <Space key={item.channel} style={{margin: "10px"}}>
          <Label>{`channel ${item.channel}`}</Label>
          <Switch
            
            onChange={(checked: boolean, event: Event) => {
                item.value = checked === true ? 1 : 0;
                console.log(channelValue);
                setValue();
            //   setChannelValue((prev) => {
            //       const data = prev.find(i => i.channel === item.channel);
            //       data.value = checked ? 1 : 0;
            //       return prev;
            //   })
            }}
          />
        </Space>
      ))}
    </Card>
  );
}
