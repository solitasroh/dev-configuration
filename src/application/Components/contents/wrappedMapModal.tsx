import WrappedElement from '@src/Data/WrappedElement';
import { Button, Col, Input, Modal, Row } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

const Label = styled.p`
  text-align: left;
  font-size: 9pt;
  min-width: 50px;
  width: 100px;
`;

interface formParams {
  address: string;

  length: string;

  wrappedAddress: string;

  page: number;
}

interface Props {
  isModalVisible: boolean;
  onOk: (
    selectedIndex: number,
    add: string,
    leng: string,
    wadd: string,
    page: number,
  ) => void;
  onCancel: () => void;
  selectedIndex: number;
  page: number;
  item: WrappedElement;
  close: () => void;
}

const wrappedMapModal: FC<Props> = ({
  isModalVisible,
  onOk,
  onCancel,
  selectedIndex,
  page,
  item,
  close,
}) => {
  const { register, handleSubmit, setValue } = useForm();
  if (item !== null && item !== undefined) {
    setValue('address', item.address?.toString());
    setValue('length', item.length?.toString());
    setValue('wrappedAddress', item.wrappedAddress?.toString());
    setValue('page', item?.page);
  }

  useEffect(() => {
    // console.log(`${item.address}, ${item.length}, ${item.wrappedAddress}`);
  }, []);

  const onSubmit = ({
    address,
    length,
    page: p,
    wrappedAddress,
  }: formParams): void => {
    console.log('on submit');
    onOk(selectedIndex, address, length, wrappedAddress, page);
    close();
  };

  return (
    <Modal
      title="사용자 지정영역 맵핑"
      visible={isModalVisible}
      // onOk={(e) => {
      //   handleSubmit(onSubmit);
      // }}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button form="myForm" key="submit" htmlType="submit">
          Submit
        </Button>,
        <Button key="cancel" onClick={e => onCancel()}>Cancel</Button>,
      ]}
    >
      <form id="myForm" onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col flex={1.5}>
            <Label>데이터 주소</Label>
          </Col>
          <Col flex={3.5}>
            <input
              type="text"
              {...register('address')}
              defaultValue={item.address}
            />
          </Col>
        </Row>
        <Row>
          <Col flex={1.5}>
            <Label>데이터 길이</Label>
          </Col>
          <Col flex={3.5}>
            <input
              type="text"
              {...register('length')}
              defaultValue={item.length}
            />
          </Col>
        </Row>
        <Row>
          <Col flex={1.5}>
            <Label>페이지</Label>
          </Col>
          <Col flex={3.5}>
            <input type="text" defaultValue={item.page} disabled {...register('page')} />
          </Col>
        </Row>
        <Row>
          <Col flex={1.5}>
            <Label>지정 영역 주소</Label>
          </Col>
          <Col flex={3.5}>
            <input
              type="text"
              {...register('wrappedAddress')}
              defaultValue={item.wrappedAddress}
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

export default wrappedMapModal;
