import A2700DataType from '@src/Data/A2700DataType';
import { REQ_DATA } from '@src/ipcChannels';
import RequestChannelProps from '@src/main/ipc/RequestChannelProps';
import IpcService from '@src/main/IPCService';
import React, { FunctionComponent } from 'react';

const App: FunctionComponent = () => {
  const ipcService = IpcService.getInstance();
  const props = new RequestChannelProps();
  props.requestType = A2700DataType.LMSetup;

  ipcService.on(REQ_DATA, (evt, ...args) => {
    console.log(evt);
    console.log(args);
  });

  return <div>test</div>;
};

export default App;
