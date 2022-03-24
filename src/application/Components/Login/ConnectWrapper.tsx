import React, { useState, useEffect, FC } from 'react';
import styled from 'styled-components';
import { Button, Typography, Space } from 'antd';

import IPCService from '@src/main/IPCService';
import { CONNECTION, DISCONNECT, GET_ENV } from '@src/ipcChannels';
import { ConnectionProps } from '@src/main/ipc/ChannelConnectServer';
import { GetEnvProps } from '@src/main/ipc/ChannelGetEnv';

import { ConnecionState, Status } from './ConnectionComponents';
import ConnectionForm from './ConnectionForm';
import ConnectionStatusBox from './ConnectionStatusBox';

const { Text } = Typography;

const Label = styled(Text)`
  color: #fefefe;
  font-size: 10px;
  margin-bottom: 5px;
`;

const IpAddress = styled(Text)`
  color: white;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 5px;
`;

interface Props {
  collapsed: boolean;
}

function StateToDisplay(state: number): string {
  switch (state) {
    case Status.CONNECTED:
      return 'CONNECTED';
    case Status.DISCONNECTED:
      return 'DISCONNECTED';
    case Status.REQUEST_CONNECT:
      return 'try to connect';
    default:
      return 'INVALID';
  }
}

const ConnectWrapper: FC<Props> = ({ collapsed }: Props) => {
  const [connectionState, setConnectionState] = useState(Status.DISCONNECTED);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [visible, setVisible] = useState(false);
  const [ipAddress, setIPAddress] = useState('127.0.0.1');

  // useEffect(() => {
  //   const service = IPCService.getInstance();
  //   // 최초 한번 연결상태를 체크
  //   service
  //     .send<boolean, ConnectionProps>(CONNECTION, {
  //       responseChannel: 'RESP-DISCONN',
  //       requestConnectState: true,
  //     })
  //     .then((connected) => {
  //       if (connected) {
  //         setConnectionState(Status.CONNECTED);
  //       } else {
  //         setConnectionState(Status.DISCONNECTED);
  //       }
  //     });
  // }, []);

  useEffect(() => {
    const service = IPCService.getInstance();
    const res = service.send<{ ipAddress: string }, GetEnvProps>(GET_ENV, {});
    res.then((result) => {
      setIPAddress(result.ipAddress);
    });

    service.on(CONNECTION, (event, args) => {
      // console.log('connected ...');
      setConnectionState(Status.CONNECTED);
    });

    service.on(DISCONNECT, (event, args) => {
      // console.log('diconnected...');
      setConnectionState(Status.DISCONNECTED);
    });
  }, []);

  const handleConnection = async (ip: string) => {
    setIPAddress(ip);
    setConfirmLoading(true);

    const service = IPCService.getInstance();
    const result = await service.send<boolean, ConnectionProps>(CONNECTION, {
      ip,
      port: 502,
    });

    setConnectionState(result ? Status.CONNECTED : Status.DISCONNECTED);
    setVisible(false);
    setConfirmLoading(false);
  };

  return (
    <>
      {collapsed ? (
        <ConnectionStatusBox
          connectionStatus={connectionState === Status.CONNECTED}
        />
      ) : (
        <Space style={{ margin: 20, padding: 5 }} direction="vertical">
          <Space align="start">
            <Label>Device IP</Label>
            <IpAddress>{ipAddress}</IpAddress>
          </Space>

          <ConnecionState connected={connectionState === Status.CONNECTED}>
            {StateToDisplay(connectionState)}
          </ConnecionState>

          <Button type="primary" onClick={() => setVisible(true)}>
            {connectionState === Status.CONNECTED ? 'Change' : 'Connect'}
          </Button>

          <ConnectionForm
            visible={visible}
            ipAddress={ipAddress}
            confirmLoading={confirmLoading}
            onCancel={() => setVisible(false)}
            onConnect={(value) => handleConnection(value)}
          />
        </Space>
      )}
    </>
  );
};
export default ConnectWrapper;
