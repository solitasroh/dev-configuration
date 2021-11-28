import React, { ReactElement } from 'react';
import { Card } from 'antd';
import MeasureData from '@src/Data/MeasureData';

import Desc from '../Desc';

type props = {
  doStatus: MeasureData<boolean>;
};
export default function LMHDOStatus({ doStatus }: props): ReactElement {
  const setDOState = (Status: boolean): string => {
    if (Status === false) return 'Open';
    if (Status === true) return 'Close';
    return 'Invaild';
  };

  return (
    <Card title="LM DO Status" size="small" type="inner">
      {doStatus?.detail.map((measure) => (
        <Desc
          key={measure.channel}
          title={`ch ${measure.channel}`}
          value={setDOState(measure.value)}
        />
      ))}
    </Card>
  );
}
