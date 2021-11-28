import React, { ReactElement, useState } from 'react';

import { Card, Radio, Row, Col } from 'antd';
import styled from 'styled-components';
import LMTestModeData from '@src/Data/LMTestModeData';
import IpcService from '@src/main/IPCService';
import { WRITE_REQ } from '@src/ipcChannels';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';

const Label = styled.p`
  text-align: left;
  font-size: 8pt;
`;

export default function LMHDITestMode(): ReactElement {
  const [channelValue] = useState<LMTestModeData>(() => {
    const data = new LMTestModeData();
    data.data = [];
    for (let i = 0; i < 18; i += 1) {
      data.data.push({
        channel: i + 1,
        value: 0,
        controlled: false,
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
  const selectTest = (cmd: number, ch: number) => {
    const st = channelValue.data.find((cv) => cv.channel === ch);
    if (cmd === 0) {
      st.value = 0;
    } else if (cmd === 1) {
      st.value = (1 << 8) | 1;
    } else {
      st.value = (1 << 8) | 0;
    }
    setValue();
  };
  return (
    <Card
      title="LMH Test Mode"
      size="small"
      type="inner"
      style={{ width: 'auto' }}
    >
      {channelValue.data.map((item) => (
        <Row gutter={16} justify="space-around" wrap={false} key={item.channel}>
          <Col flex="100px">
            <Label>{`channel ${item.channel}`}</Label>
          </Col>
          {/* <Switch
            size="small"
            onChange={(checked: boolean) => {
              checkTestValue(item.channel, checked);
            }}
          /> */}
          <Col flex="auto">
            <Radio.Group
              size="small"
              defaultValue="normal"
              onChange={(e) => {
                if (e.target.value === 'normal') selectTest(0, item.channel);
                else if (e.target.value === 'Energized')
                  selectTest(1, item.channel);
                else selectTest(2, item.channel);
              }}
            >
              <Radio.Button
                value="normal"
                style={{
                  fontSize: 9,
                  width: 80,
                  textAlign: 'center',
                }}
              >
                normal
              </Radio.Button>
              <Radio.Button
                value="Energized"
                style={{
                  fontSize: 9,
                  width: 80,
                  textAlign: 'center',
                }}
              >
                Energized
              </Radio.Button>
              <Radio.Button
                value="De-energized"
                style={{
                  fontSize: 9,
                  width: 80,
                  textAlign: 'center',
                }}
              >
                De-energized
              </Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      ))}
    </Card>
  );
}
