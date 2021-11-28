import LDHInfoData from '@src/Data/LDHInfoData';

import React, { FC, useState } from 'react';
import { Card, Select } from 'antd';
import { usePolling } from '@src/application/hooks/ipcHook';
import Desc from '../Desc';

const { Option } = Select;
const LDHInfoContainer: FC = () => {
  const [loading, setLoading] = useState(true);
  const [information, setInformation] = useState<LDHInfoData>(null);
  const [requestPartnerInfo, setRequestPartnerInfo] = useState(false);
  usePolling(
    {
      requestType: 'A2750LDInformation',
      responseChannel: 'POLL-LD-Information',
      props: {
        id: 0,
        data: requestPartnerInfo,
      },
    },
    (evt, resp) => {
      const data = resp as LDHInfoData;
      setInformation(data);
      setLoading(false);
    },
    3000,
  );

  const informationSelectionChangeHandle = (value: any) => {
    if (value === 1) {
      setRequestPartnerInfo(false);
    } else {
      setRequestPartnerInfo(true);
    }
  };
  return (
    <Card
      title="LDH Information"
      size="small"
      type="inner"
      loading={loading}
      extra={
        <Select
          size="small"
          style={{ fontSize: 9 }}
          defaultValue={1}
          onChange={informationSelectionChangeHandle}
        >
          <Option value={1}>PORT-1</Option>
          <Option value={2}>PORT-2</Option>
        </Select>
      }
    >
      <Desc title="operation state" value={information?.operationStatus} />
      <Desc title="product code" value={information?.productCode} />
      <Desc title="serial number" value={information?.serialNumber} />
      <Desc
        title="hardware revision"
        value={information?.hardwareRevision.toString()}
      />
      <Desc
        title="application version"
        value={information?.applicationVersion}
      />
      <Desc title="kernel version" value={information?.kernelVersion} />
      <Desc title="bootloader version" value={information?.bootloaderVersion} />
    </Card>
  );
};

export default LDHInfoContainer;
