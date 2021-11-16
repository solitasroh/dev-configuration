import React, { useState } from 'react';
import { Button, Modal, Input, Typography, Divider } from 'antd';

import IPCService from '@src/main/IPCService';
import { CONNECTION } from '@src/ipcChannels';
import { ConnectionProps } from '@src/main/ipc/ChannelConnectServer';

const { Title, Text } = Typography;

function ConnectWrapper() {
  const [connectionState, setConnectionState] = useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [visible, setVisible] = useState(false);
  const [ipAddress, setIPAddress] = useState('127.0.0.1');
  const onConnect = async () => {
    setConfirmLoading(true);

    const service = IPCService.getInstance();
    const result = await service.send<boolean, ConnectionProps>(CONNECTION, {
      responseChannel: 'RESP-CONNECTION',
      ip: ipAddress,
      port: 502,
      connect: true,
    });

    setConnectionState(result);
    setVisible(false);
    setConfirmLoading(false);
  };
  const handleConnect = async () => {
    if (!connectionState) {
      setVisible(true);
    } else {
      const service = IPCService.getInstance();
      await service.send<boolean, ConnectionProps>(CONNECTION, {
        responseChannel: 'RESP-DISCONN',
        ip: ipAddress,
        port: 502,
        connect: false,
      });

      setConnectionState(false);
    }
  };
  return (
    <div>
      {connectionState ? (
        <Text type="success" className="connection-title">
          `connected to device`
        </Text>
      ) : (
        <Divider style={{ borderColor: 'white', margin: '10px 0 10 0' }}>
          <Text className="connection-title">connect to device</Text>
        </Divider>
      )}
      <Button
        type="primary"
        style={{ backgroundColor: connectionState ? 'green' : 'red' }}
        className="connection-btn"
        onClick={handleConnect}
      >
        {connectionState ? 'disconnect' : 'Connect'}
      </Button>
      <Modal
        title="Connect to device"
        centered
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={onConnect}
        onCancel={() => setVisible(false)}
      >
        <p>A2700IP</p>
        <Input onChange={(e) => setIPAddress(e.target.value)} />
      </Modal>
    </div>
  );
}
export default ConnectWrapper;
