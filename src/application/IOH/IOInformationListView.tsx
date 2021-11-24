import IOInformation from '@src/Data/A2700.IOInformation';
import React, { FC, useState } from 'react';
import { List } from 'antd';
import IOHInformationView from './IOHInformationView';
import { usePolling } from '../hooks/ipcHook';
import IODIOMeasure from './IODIOMeasure';
import IODOControl from './IODOControl';

const IOInformationListView: FC = () => {
  const tmpInfo: IOInformation[] = [];
  const [information, setInformation] = useState<IOInformation[]>(tmpInfo);

  usePolling('POLL-IO-Information', (evt, rest) => {
    const data = rest as IOInformation[];
    setInformation(data);
  });

  const idArray = information.filter(
    (data) => data.operationStatus === 'OPERATING' && data.moduleType === 'DIO',
  );
  const idArray2 = information.filter(
    (data) => data.operationStatus !== 'UNINDENTIFIED',
  );
  return (
    <div>
      <List
        grid={{
          gutter: 16,
          column: 2,
        }}
        dataSource={idArray2}
        renderItem={(item) => (
          <List.Item>
            <IOHInformationView information={item} />
          </List.Item>
        )}
      />
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
        dataSource={idArray}
        renderItem={(item) => (
          <List.Item>
            <IODIOMeasure id={item.id} />
          </List.Item>
        )}
      />
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
        dataSource={idArray}
        renderItem={(item) => (
          <List.Item>
            <IODOControl id={item.id} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default IOInformationListView;
