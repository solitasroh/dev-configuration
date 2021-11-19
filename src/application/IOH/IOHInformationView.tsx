import React, { FC } from 'react';
import styled from 'styled-components';


import { Card, Space } from 'antd';
import IOInformation from '@src/Data/A2700.IOInformation';

const Label = styled.p`
  width: 110px;
  text-align: left;
  font-size: 8pt;
`;

const Value = styled.p`
  width: 150px;
  text-align: center;
  align-items: center;
  font-weight: 600;
  font-size: 9pt;
  background-color: #f5f5f5;
`;
  // const tmpInfo = new IOInformation();
  // const [information, setInformation] = useState<IOInformation>(tmpInfo);

  // useEffect(() => {
  //   const ipcService = IpcService.getInstance();
  //   ipcService
  //     .send<IOInformation[], ChannelReadDataProps>(REQ_DATA, {
  //       requestType: 'A2750IOInformation',
  //       responseChannel: 'RES-IO',
  //       params: { id },
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       setInformation(data[0]);
  //     });
  //     return () => setInformation(null);
  // }, []);
  type props = {
    information: IOInformation;
  }

const IOHInformationView: FC<props> = ({information}) => {
  const {
    id,
    operationStatus,
    productCode,
    serialNumber,
    hardwareRevision,
    applicationVersion,
    bootloaderVersion
  } = information;

  return (
    <Card
      title={`IOH Information (${id})`}
      size="small"
      style={{ width: '300px' }}
      type="inner"
    >
      <div>
        <Space size="small">
          <Label>operation state</Label>
          <Value>{operationStatus ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>product code</Label>
          <Value>{productCode ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>serial number</Label>
          <Value>{serialNumber ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>hardware revision</Label>
          <Value>{hardwareRevision ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>application version</Label>
          <Value>{applicationVersion ?? 'null'}</Value>
        </Space>

        <Space size="small">
          <Label>bootloader version</Label>
          <Value>{bootloaderVersion ?? 'null'}</Value>
        </Space>
      </div>
    </Card>
  );
};

export default IOHInformationView;
