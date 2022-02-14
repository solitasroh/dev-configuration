import WrappedElement from '@src/Data/WrappedElement';
import { Button, Modal, Form, Input, InputNumber } from 'antd';
import React, { FC } from 'react';

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
  const onFinish = (values: any) => {
    onOk(
      selectedIndex,
      values.address,
      values.length,
      values.wrappedAddress,
      page,
    );
    close();
  };

  return (
    <Modal
      title="user define map"
      visible={isModalVisible}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button form="myForm" key="submit" htmlType="submit">
          Submit
        </Button>,
        <Button key="cancel" onClick={() => onCancel()}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        id="myForm"
        name="wrappedItem"
        onFinish={onFinish}
        layout="vertical"
        size="small"
      >
        <Form.Item
          label="User Address"
          name="wrappedAddress"
          rules={[{ required: true, message: 'please input user addresss',} , {
            type: 'number',
            max: (page===1000) ? 6000 : 1024,
            message: `The user address is not a number, max = ${(page===1000) ? 6000 : 1024}`
          }]}
        >
          <InputNumber defaultValue={item.wrappedAddress} style={{ width: '100%' }}/>
        </Form.Item>
        <Form.Item
          label="Data Length"
          name="length"
          rules={[{ required: true, message: 'please input data length' } , {
            type: 'number',
            max: (page===1000) ? 6000 : 1024,
            message: `The length is not a number, max = ${(page===1000) ? 6000 : 1024}`
          }]}
        >
          <InputNumber type="number" defaultValue={item.length} style={{ width: '100%' }}/>
        </Form.Item>
        <Form.Item
          label="Data Address"
          name="address"
          rules={[{ required: true, message: 'please input data address' } , {
            type: 'number',
            max: (page===1000) ? 65535 : 65535,
            message: `The data address is not a number, max = ${(page===1000) ? 65535 : 65535}`
          }]}
        >
          <InputNumber type="number" defaultValue={item.address} style={{ width: '100%' }}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default wrappedMapModal;
