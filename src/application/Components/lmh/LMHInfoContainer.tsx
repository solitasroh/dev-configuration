import React, { FC, useState } from 'react';
import { Card, Select } from 'antd';

import { usePolling } from '@src/application/hooks/ipcHook';
import LMHInfoData from '@src/Data/LMHInfoData';
import Desc from '../Desc';

const { Option } = Select;

const LMHInfoContainer: FC = () => {
  const [loading, setLoading] = useState(true);
  const [information, setInformation] = useState<LMHInfoData>(null);
  const [requestPartnerInfo, setRequestPartnerInfo] = useState(false);

  usePolling(
    {
      requestType: 'A2750LMInformation',
      responseChannel: 'POLL-LM-Information',
      props: {
        id: 0,
        data: requestPartnerInfo,
      },
    },
    (evt, resp) => {
      const data = resp as LMHInfoData;
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
      title="LMH Information"
      size="small"
      type="inner"
      loading={loading}
      style={{ minWidth: 150 }}
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
      <Desc title="bootloader version" value={information?.bootloaderVersion} />
    </Card>
  );
};

export default LMHInfoContainer;
