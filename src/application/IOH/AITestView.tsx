import React, { ReactElement, useEffect, useState } from 'react';

import { Card, Space, Select, Input, Button } from 'antd';
import styled from 'styled-components';
import LMTestModeData from '@src/Data/LMTestModeData';
import IpcService from '@src/main/IPCService';
import { WRITE_REQ } from '@src/ipcChannels';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';

const { Option } = Select;

const Label = styled.p`
  text-align: left;
  font-size: 8pt;
  min-width: 50px;
  width: 70px;
`;

export default function AITestView(): ReactElement {
  const [id, setId] = useState(0);
  const channelValue = new LMTestModeData(12);

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

  const idSelect = (value: number) => {
    setId(value);
  };

  return (
    <Card title="IO Test Mode" size="small" type="inner">
      <div>
        <Space size="small" style={{ margin: '10px' }}>
          <Label>Select ID</Label>
          <Select defaultValue={0} onChange={idSelect} style={{ width: 120 }}>
            <Option value={1}>1</Option>
            <Option value={2}>2</Option>
            <Option value={3}>3</Option>
            <Option value={4}>4</Option>
            <Option value={5}>5</Option>
            <Option value={6}>6</Option>
            <Option value={7}>7</Option>
            <Option value={8}>8</Option>
            <Option value={9}>9</Option>
            <Option value={10}>10</Option>
            <Option value={11}>11</Option>
            <Option value={12}>12</Option>
            <Option value={13}>13</Option>
            <Option value={14}>14</Option>
            <Option value={15}>15</Option>
          </Select>
          <Button onClick={() => setValue()} > Apply</Button>
        </Space>
      </div>
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
