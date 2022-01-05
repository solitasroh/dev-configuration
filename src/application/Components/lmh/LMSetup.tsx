import React, { ReactElement, useState } from 'react';

import { Button, Space } from 'antd';
import LMManagementSetup from '@src/Data/LMHManageSetup';
import IpcService from '@src/main/IPCService';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';
import { WRITE_REQ } from '@src/ipcChannels';
import { useOncePolling } from '@src/application/hooks/ipcHook';

export default function LMHSetup(): ReactElement {
  const [optionsState, setoptionsState] = useState(0);
  
  useOncePolling(
    {
      requestType: 'LMManagementSetup',
      responseChannel: 'POLL-LM-MANAGEMENT-SETUP',
    },
    (evt, resp) => {
      const data = resp as LMManagementSetup;
      setoptionsState(data.managementMode);
      console.log("use Once Polling %d", data.managementMode)
    },
  );

  const onApply = () => {
    const data = new LMManagementSetup();
    data.managementMode = optionsState;

    const service = IpcService.getInstance();
    service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
      writeData: data,
      requestType: 'LMManagementSetup',
    });
    
  };
  const selectChanged = (event: any) => {
    const { value } = event.target;
    setoptionsState(value);
  }

  return (
    <Space>
      <select value={optionsState} onChange={selectChanged}>
        <option value="0">None</option>
        <option value="1">LCG</option>
        <option value="2">LMH</option>
      </select>
      <Button onClick={onApply}>Apply</Button>
    </Space>
  );
}
