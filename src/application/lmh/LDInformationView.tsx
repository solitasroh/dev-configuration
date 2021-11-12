import LDInformation from '@src/Data/A2700.LDInformation';
import LMInformation from '@src/Data/A2700.LMInformation';
import A2700Data from '@src/Data/A2700Data';
import { REQ_DATA } from '@src/ipcChannels';
import RequestChannelProps from '@src/main/ipc/RequestChannelProps';
import IpcService from '@src/main/IPCService';
import React, { FC, useEffect, useState } from 'react';
import {
  CardHeader,
  CardHeading,
  CardLabel,
  CardLabelSet,
  CardValue,
  CardWrapper,
} from '../Components/Card';

const LDInformationView: FC = () => {
  const tmpInfo = new LDInformation();
  const [information, setInformation] = useState<LDInformation>(tmpInfo);

  useEffect(() => {
    const ipcService = IpcService.getInstance();
    const props = new RequestChannelProps();

    props.requestType = 'A2750LDInformation';
    
    ipcService.send<{data: LDInformation}>(REQ_DATA, props).then((data) => {
        console.log(data.data);
      setInformation(data.data);
    });
  }, []);

  return (
    <CardWrapper>
      <CardHeader>
        <CardHeading>LDH Information</CardHeading>
      </CardHeader>
      <CardLabelSet>
        <CardLabel>operation state</CardLabel>
        <CardValue>{information.operationStatus}</CardValue>
      </CardLabelSet>
      <CardLabelSet>
        <CardLabel>product code</CardLabel>
        <CardValue>{information.productCode}</CardValue>
      </CardLabelSet>
      <CardLabelSet>
        <CardLabel>serial number</CardLabel>
        <CardValue>{information.serialNumber??"null"}</CardValue>
      </CardLabelSet>
      <CardLabelSet>
        <CardLabel>hardware revision</CardLabel>
        <CardValue>{information.hardwareRevision??"null"}</CardValue>
      </CardLabelSet>
      <CardLabelSet>
        <CardLabel>application version</CardLabel>
        <CardValue>{information.applicationVersion}</CardValue>
      </CardLabelSet>
      <CardLabelSet>
        <CardLabel>kernel version</CardLabel>
        <CardValue>{information.kernelVersion}</CardValue>
      </CardLabelSet>
      <CardLabelSet>
        <CardLabel>bootloader version</CardLabel>
        <CardValue>{information.bootloaderVersion??"null"}</CardValue>
      </CardLabelSet>
    </CardWrapper>
  );
};

export default LDInformationView;
