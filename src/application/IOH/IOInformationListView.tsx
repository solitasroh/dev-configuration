import IOInformation from '@src/Data/A2700.IOInformation';
import { REQ_DATA } from '@src/ipcChannels';
import ChannelReadDataProps from '@src/main/ipc/ChannelReadDataProps';
import IpcService from '@src/main/IPCService';
import React, { FC, useState, useEffect } from 'react';
import { List } from 'antd';
import IOHInformationView from './IOHInformationView';

const IOInformationListView: FC = () => {
  const tmpInfo: IOInformation[] = [];
  const [information, setInformation] = useState<IOInformation[]>(tmpInfo);
  useEffect(() => {
    const ipcService = IpcService.getInstance();
    ipcService
      .send<IOInformation[], ChannelReadDataProps>(REQ_DATA, {
        requestType: 'A2750IOInformation',
        responseChannel: 'RES-IO',
        props: { id: 0 },
      })
      .then((data) => {
        setInformation(data);
      });
    return () => setInformation(null);
  }, []);

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
