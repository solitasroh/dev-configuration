import React, { FC, useState } from 'react';
import { Card, Empty, Space } from 'antd';
import styled from 'styled-components';

import { usePolling } from '@src/application/hooks/ipcHook';
import LMHInfoData from '@src/Data/LMHInfoData';

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

type props = {
  partnerInfo: boolean;
};

const LMHInfoContainer: FC<props> = ({ partnerInfo }) => {
  const [information, setInformation] = useState<LMHInfoData>(null);
  const respChannel = partnerInfo
    ? 'POLL-LM-Information-Partener'
    : 'POLL-LM-Information';
  usePolling(
    {
      requestType: 'A2750LMInformation',
      responseChannel: respChannel,
      props: {
        id: 0,
        data: partnerInfo,
      },
    },
    (evt, resp) => {
      const data = resp as LMHInfoData;
      setInformation(data);
    },
    1000,
  );

  return information === null ? (
    <Empty description="LMH No Data" />
  ) : (
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

export default LMHInfoContainer;
