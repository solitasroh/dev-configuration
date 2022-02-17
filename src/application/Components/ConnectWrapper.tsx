import React, { useState, useEffect, FC } from 'react';
import styled, { keyframes } from 'styled-components';
import { Button, Modal, Input, Typography, Space } from 'antd';

import IPCService from '@src/main/IPCService';
import { CONNECTION, DISCONNECT, GET_ENV } from '@src/ipcChannels';
import { ConnectionProps } from '@src/main/ipc/ChannelConnectServer';
import { GetEnvProps } from '@src/main/ipc/ChannelGetEnv';

const { Text } = Typography;

const InfoLabel = styled(Text)`
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
const fadeIn = keyframes`
  0%{
    opacity: 1;
  }
  50%{
    opacity: 0;
  }
  100%{
    oapcity: 1;
  }
`;

const ConnecionState = styled.div<{ connected: boolean }>`
  color: #fafafa;
  font-size: 10px;
  margin-bottom: 5px;
  opacity: 1;
  color: ${(prop) => (prop.connected ? '#428e68' : 'red')};
  animation: ${fadeIn} ${(prop) => (prop.connected ? '0s' : '2.5s')} infinite;
`;

const STATE_CONNECTED = 1;
const STATE_DISCONNECTED = 2;
const STATE_REQUEST_CONNECT = 4;

const ConnectWrapper: FC = () => {
  const [connectionState, setConnectionState] = useState(STATE_DISCONNECTED);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [visible, setVisible] = useState(false);
  const [ipAddress, setIPAddress] = useState('127.0.0.1');

  useEffect(() => {
    const service = IPCService.getInstance();
    // 최초 한번 연결상태를 체크
    service
      .send<boolean, ConnectionProps>(CONNECTION, {
        responseChannel: 'RESP-DISCONN',
        requestConnectState: true,
      })
      .then((connected) => {
        if (connected) {
          setConnectionState(STATE_CONNECTED);
        } else {
          setConnectionState(STATE_DISCONNECTED);
        }
      });
  }, []);

  useEffect(() => {
    const service = IPCService.getInstance();
    console.log('started..');
    const res = service.send<{ ipAddress: string }, GetEnvProps>(GET_ENV, {});
    res.then((result) => {
      console.log(result.ipAddress);
      setIPAddress(result.ipAddress);
    });

    service.on(CONNECTION, (event, args) => {
      setConnectionState(STATE_CONNECTED);
    });

    service.on(DISCONNECT, (event, args) => {
      setConnectionState(STATE_DISCONNECTED);
    });
  }, []);

  const onConnect = async () => {
    setConfirmLoading(true);
    const service = IPCService.getInstance();

    if (connectionState === STATE_CONNECTED) {
      await service.send<boolean, ConnectionProps>(CONNECTION, {
        responseChannel: 'RESP-DISCONN',
        ip: ipAddress,
        port: 502,
        connect: false,
      });
    }

    const result = await service.send<boolean, ConnectionProps>(CONNECTION, {
      responseChannel: 'RESP-CONNECTION',
      ip: ipAddress,
      port: 502,
      connect: true,
    });

    setConnectionState(result ? STATE_CONNECTED : STATE_DISCONNECTED);
    setVisible(false);
    setConfirmLoading(false);
  };
  const handleConnect = async () => {
    setVisible(true);
  };

  const StateToDisplay = (state: number) => {
    switch (state) {
      case STATE_CONNECTED:
        return 'CONNECTED';
      case STATE_DISCONNECTED:
        return 'DISCONNECTED';
      case STATE_REQUEST_CONNECT:
        return 'try to connect';
      default:
        return 'INVALID';
    }
  };

  return (
    <Space style={{ margin: 20, padding: 5 }} direction="vertical">
      <Space align="start">
        <InfoLabel>device IP</InfoLabel>
        <IpAddress>{ipAddress}</IpAddress>
      </Space>
      <ConnecionState connected={connectionState === STATE_CONNECTED}>
        {StateToDisplay(connectionState)}
      </ConnecionState>

      <Button type="primary" className="connection-btn" onClick={handleConnect}>
        change connect
      </Button>
      <Modal
        title="Connect to A2700 device"
        centered
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={onConnect}
        onCancel={() => setVisible(false)}
      >
        <p>A2700IP</p>
        <Input
          onChange={(e) => setIPAddress(e.target.value)}
          onPressEnter={onConnect}
        />
      </Modal>
    </Space>
  );
};
export default ConnectWrapper;
