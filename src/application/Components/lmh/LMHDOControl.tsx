import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, Col, Radio, Row } from 'antd';

import IpcService from '@src/main/IPCService';
import { WRITE_REQ } from '@src/ipcChannels';
import IOCommand from '@src/Data/IOCommand';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';
import MeasureData from '@src/Data/MeasureData';

const Label = styled.p`
  text-align: left;
  font-size: 8pt;
`;

type statusButtonProps = {
  state: boolean;
};

const StatusButton = styled(Radio.Button)<statusButtonProps>`
  background-color: ${(props) => (props.state ? '#ffffff' : '#2aad65')};
  color: ${(props) => (props.state ? '#000' : '#ffffff')};
`;

const service = IpcService.getInstance();

type Props = {
  doStatus: MeasureData<boolean>;
};

export default function LMHDOControl({ doStatus }: Props): ReactElement {
  const [ioCommand] = useState<IOCommand>(new IOCommand(9));

  useEffect(() => {
    doStatus?.detail.forEach((item) => {
      ioCommand.command(item.channel, item.value ? 1 : 0);
    });
  }, [doStatus]);

  const apply = () => {
    service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
      writeData: ioCommand,
      requestType: 'LMCommand',
    });
  };

  const handleCommand = (value: number, ch: number): void => {
    ioCommand.command(ch, value);
    apply();
  };

  return (
    <Card title="LMH DO Control" size="small" type="inner">
      {ioCommand?.data.map((item) => (
        <Row key={item.channel}>
          <Col flex="100px">
            <Label>DO {item.channel}</Label>
          </Col>
          <Col flex="auto">
            <Radio.Group
              size="small"
              defaultValue={0}
              value={doStatus?.detail[item.channel - 1].value}
              onChange={(e) => handleCommand(e.target.value, item.channel)}
            >
              <StatusButton
                value={0}
                style={{
                  fontSize: 9,
                  width: 80,
                  textAlign: 'center',
                }}
                state={doStatus?.detail[item.channel - 1].value}
              >
                Open
              </StatusButton>
              <StatusButton
                value={1}
                style={{
                  fontSize: 9,
                  width: 80,
                  textAlign: 'center',
                }}
                state={!doStatus?.detail[item.channel - 1].value}
              >
                Close
              </StatusButton>
            </Radio.Group>
          </Col>
        </Row>
      ))}
    </Card>
  );
}
