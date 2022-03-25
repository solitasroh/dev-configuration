import React, { ReactElement, useEffect, useState } from 'react';
import { Collapse, Empty, Space } from 'antd';
import PCStatus from '@src/Data/PCStatus';
import IpcService from '@src/main/IPCService';
import {
  DefaultView,
  DIStatusView,
  DOStatusView,
  ProtectionView,
} from './PCStatus';
import PCControl from './PCControl';
import { usePolling } from '../../hooks/ipcHook';

const { Panel } = Collapse;
type Props = {
  id: number;
};
export default function ControlStatus({ id }: Props): ReactElement {
  const [statusList, setStatusList] = useState<PCStatus>();

  usePolling(
    {
      requestType: 'A2750PCStatus',
      responseChannel: 'POLL-PC-STATUS',
      props: {
        id,
      },
    },
    (evt, resp) => {
      const data = resp as PCStatus;
      setStatusList(data);
    },
    500,
  );

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ProtectionView id={id} status={statusList} />
      </div>
    </div>
  );
}
