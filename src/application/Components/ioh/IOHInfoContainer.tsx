import React, { FC } from 'react';
import styled from 'styled-components';

import { Card, Empty, Space } from 'antd';
import IOHInfoData from '@src/Data/IOHInfoData';

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

const Wrapper = styled.div<{ enable: boolean }>`
  background-color: ${(props) => (props.enable ? 'white' : 'gray')};
`;

type props = {
  information: IOHInfoData;
};

const IOHInfoContainer: FC<props> = ({ information }) =>
  information == null ? (
    <Empty />
  ) : (
    <Card
      title={`IOH Information (${information.id})`}
      size="small"
      style={{ width: '300px' }}
      type="inner"
    >
      <Wrapper enable>
        <Space size="small">
          <Label>operation state</Label>
          <Value>{information.operationStatus ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>module type</Label>
          <Value>{information.moduleType ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>product code</Label>
          <Value>{information.productCode ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>serial number</Label>
          <Value>{information.serialNumber ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>hardware revision</Label>
          <Value>{information.hardwareRevision ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>application version</Label>
          <Value>{information.applicationVersion ?? 'null'}</Value>
        </Space>
        <Space size="small">
          <Label>bootloader version</Label>
          <Value>{information.bootloaderVersion ?? 'null'}</Value>
        </Space>
      </Wrapper>
    </Card>
  );

export default IOHInfoContainer;
