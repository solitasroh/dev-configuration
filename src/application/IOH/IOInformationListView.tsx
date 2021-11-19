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
        params: { id: 0 },
      })
      .then((data) => {
          console.log(data);
        setInformation(data);
      });
  }, []);

  return (
    <List
      grid={{
        gutter: 16,
        column: 5,
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
