import IOInformation from '@src/Data/A2700.IOInformation';
import React, { FC, useState } from 'react';
import { List } from 'antd';
import IOHInformationView from './IOHInformationView';
import { usePolling } from '../hooks/ipcHook';

const IOInformationListView: FC = () => {
  const tmpInfo: IOInformation[] = [];
  const [information, setInformation] = useState<IOInformation[]>(tmpInfo);
  usePolling("POLL-IO-Information",  (evt, rest) => {
    const data = rest as IOInformation[];
    setInformation(data);
  })
  
  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3,
        xxl: 5,
      }}
      dataSource={information}
      renderItem={(item) => (
        <List.Item>
          <IOHInformationView information={item} />
        </List.Item>
      )}
    />
  );
};

export default IOInformationListView;
