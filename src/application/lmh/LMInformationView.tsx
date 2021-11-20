import React, { FC, useEffect, useState } from 'react';
import LMInformation from '@src/Data/A2700.LMInformation';
import styled from 'styled-components';
import { REQ_DATA } from '@src/ipcChannels';
import ChannelReadDataProps from '@src/main/ipc/ChannelReadDataProps';
import IpcService from '@src/main/IPCService';

import { Card, Space } from 'antd';

const Label = styled.p`
  width: 110px;
  text-align: left;
  font-size: 8pt;
`;

const Value = styled.p`
  width: 150px;
  text-align: center;
  align-items: center;
  font-weight: 600;
  font-size: 9pt;
  background-color: #f5f5f5;
`;

const LMInformationView: FC = () => {
  const tmpInfo = new LMInformation();
  const [information, setInformation] = useState<LMInformation>(tmpInfo);

  useEffect(() => {
    const ipcService = IpcService.getInstance();
    const props = new ChannelReadDataProps();

    props.requestType = 'A2750LMInformation';
    ipcService
      .send<LMInformation, ChannelReadDataProps>(REQ_DATA, {
        requestType: 'A2750LMInformation',
        responseChannel: 'RES-LM',
        props: {
          id: 0,
          data: false,
        },
      })
      .then((data) => {
        setInformation(data);
      });
    return () => setInformation(null);
  }, []);

  return (
    <Card
      title="LMH Information"
      size="small"
      style={{ width: '300px' }}
      type="inner"
    >
      <div>
        <Space size="small">
          <Label>operation state</Label>
          <Value>{information.operationStatus ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>product code</Label>
          <Value>{information.productCode ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>serial number</Label>
          <Value>{information.serialNumber ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>hardware revision</Label>
          <Value>{information.hardwareRevision ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>application version</Label>
          <Value>{information.applicationVersion ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>bootloader version</Label>
          <Value>{information.bootloaderVersion ?? 'null'}</Value>
        </Space>
      </div>
    </Card>
  );
};

export default LMInformationView;
