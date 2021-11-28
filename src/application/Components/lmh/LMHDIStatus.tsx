import React, { ReactElement, useState } from 'react';
import { Card } from 'antd';

import MeasureData from '@src/Data/MeasureData';
import { usePolling } from '@src/application/hooks/ipcHook';

import Desc from '../Desc';

export default function LMHDIStatus(): ReactElement {
  const [loading, setLoading] = useState(true);
  const setDIState = (Status: boolean): string => {
    if (Status === false) return 'De-Energized';
    if (Status === true) return 'Energized';
    return 'Invaild';
  };
  const [measureData, setMeasureData] = useState<MeasureData<boolean>>();

  usePolling(
    {
      requestType: 'LMDIData',
      responseChannel: 'POLL-LM-DI-Data',
      props: { id: 0 },
    },
    (event, resp) => {
      const data = resp as MeasureData<boolean>;
      setMeasureData(data);
      setLoading(false);
    },
    300,
  );

  return (
    <Card title="LM DI Status" size="small" type="inner" loading={loading}>
      {measureData?.detail.map((measure, index) => (
        <Desc
          title={`ch ${index + 1}`}
          value={setDIState(measure.value)}
          key={measure.channel}
        />
      ))}
    </Card>
  );
}
