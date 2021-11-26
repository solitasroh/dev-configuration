import React, { ReactElement, useState } from 'react';

import { Card, Radio, Space } from 'antd';
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

export default function IOHDITestMode({ id }: Props): ReactElement {
  const channelValueTmp = new LMTestModeData(11);
  const [channelValue] = useState<LMTestModeData>(channelValueTmp);

  const setValue = () => {
    const service = IpcService.getInstance();
    channelValue.id = id;
    service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
      writeData: channelValue,
      requestType: 'IODiTest',
    });
  };
  const selectTest = (cmd: number, ch: number) => {
    const st = channelValue.data.find((cv) => cv.channel === ch);
    if (cmd === 0) {
      st.controlled = false;
      st.value = 0;
    } else if (cmd === 1) {
      st.controlled = true;
      st.value = 1;
    } else {
      st.controlled = true;
      st.value = 0;
    }
    setValue();
  };
  return (
    <Card title="IO Test Mode" size="small" type="inner">
      <div>
        {channelValue.data.map((item) => (
          <Space key={item.channel} style={{ margin: '10px' }}>
            <Label>{`channel ${item.channel}`}</Label>
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
              <Radio.Button value="normal">normal</Radio.Button>
              <Radio.Button value="Energized">Energized</Radio.Button>
              <Radio.Button value="De-energized">De-energized</Radio.Button>
            </Radio.Group>
          </Space>
        ))}
      </div>
    </Card>
  );
}
