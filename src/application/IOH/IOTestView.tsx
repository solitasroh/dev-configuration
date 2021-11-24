import React, { ReactElement } from 'react';

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
type Props = {
  id: number;
};

export default function IOTestView({id} :Props): ReactElement {
  const channelValue = new LMTestModeData(11);
  
  const setValue = () => {
    const service = IpcService.getInstance();
    channelValue.id = id;
    service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
      writeData: channelValue,
      requestType: 'IODiTest',
    });
  };
  const checkTestValue = (ch: number, value: boolean) => {
    const st = channelValue.data.find((cv) => cv.channel === ch);
    st.value = value ? 1 : 0;
    setValue();
  };

  return (
    <Card title="IO Test Mode" size="small" type="inner">
      <div>
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
      </div>
    </Card>
  );
}
