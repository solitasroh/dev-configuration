import A2700Data from '@src/Data/A2700Data';
import A2700DataType from '@src/Data/A2700DataType';
import { REQ_DATA } from '@src/ipcChannels';
import RequestChannelProps from '@src/main/ipc/RequestChannelProps';
import IpcService from '@src/main/IPCService';
import React, { FunctionComponent } from 'react';

const App: FunctionComponent = () => {
  const ipcService = IpcService.getInstance();
  const props = new RequestChannelProps();
  props.requestType = A2700DataType.LMSetup;

  ipcService.send<{ data: A2700Data }>(REQ_DATA, props).then((data) => {
    console.log(data);
  });

  return <div>test</div>;
};

export default App;
