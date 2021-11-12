import LMSetupData from '@src/Data/A2700.LMSetup';
import A2700Data from '@src/Data/A2700Data';
import { REQ_DATA, WRITE_REQ } from '@src/ipcChannels';
import RequestChannelProps from '@src/main/ipc/RequestChannelProps';
import IpcService from '@src/main/IPCService';
import React, { FunctionComponent } from 'react';
import LMMain from './lmh/LMMain';

const App: FunctionComponent = () => {
  // const ipcService = IpcService.getInstance();

  // const props = new RequestChannelProps();
  // props.requestType = 'A2750LMSetup';

  // ipcService.send<{ data: A2700Data }>(REQ_DATA, props).then((data) => {
  //   if (data instanceof LMSetupData) {
  //     console.log(data.alarmThreshold);
  //   }
  //   console.log(data);
  // });

  // ipcService.send(WRITE_REQ, props).then(() => {
  //   console.log('write success');
  // });

  return (
    <div>
      <LMMain />
    </div>
  );
};

export default App;
