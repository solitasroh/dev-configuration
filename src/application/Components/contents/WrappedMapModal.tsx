import WrappedElement from '@src/Data/WrappedElement';
import { Button, Modal, Form, InputNumber, Checkbox } from 'antd';
import React, { FC, useState } from 'react';

interface Props {
  isModalVisible: boolean;
  onOk: (
    selectedIndex: number,
    add: string,
    leng: string,
    wadd: string,
    dataAddrOffset: string,
    userAddrOffset: string,
    numD: string,
    enable: boolean,
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
  const [isVisible, setIsVisible] = useState(false);
  const [myForm] = Form.useForm();

  myForm.setFieldsValue(item);

  const onFinish = (values: any) => {
    setIsVisible(false);
    onOk(
      selectedIndex,
      values.address,
      values.length,
      values.wrappedAddress,
      values.dataAddrOffset,
      values.userAddrOffset,
      values.numberOfDevice,
      isVisible,
      page,
    );

    myForm.setFieldsValue(new WrappedElement());
    myForm.resetFields();
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
        form={myForm}
        name="wrappedItem"
        onFinish={onFinish}
        layout="vertical"
        size="small"
      >
        <Form.Item name="A2750PC" valuePropName="checked">
          <Checkbox
            onChange={() => setIsVisible(!isVisible)}
            disabled={selectedIndex > -1}
          >
            A2750PC
          </Checkbox>
        </Form.Item>
        <Form.Item
          label="User Address"
          name="wrappedAddress"
          rules={[
            { required: true, message: 'please input user address' },
            {
              type: 'number',
              max: page === 1000 ? 6000 : 1024,
              message: `The user address is not a number, max = ${
                page === 1000 ? 6000 : 1024
              }`,
            },
          ]}
        >
          <InputNumber
            defaultValue={item.wrappedAddress}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="User Address Offset"
          name="userAddrOffset"
          rules={[
            { required: false, message: 'please input user address offset' },
            {
              type: 'number',
              max: 111,
              message: `The user address offset is not a number, max = ${111}`,
            },
          ]}
        >
          <InputNumber
            defaultValue={item.userAddrOffset}
            style={{ width: '100%' }}
            disabled={!isVisible}
          />
        </Form.Item>
        <Form.Item
          label="Data Length"
          name="length"
          rules={[
            { required: true, message: 'please input data length' },
            {
              type: 'number',
              max: page === 1000 ? 6000 : 1024,
              message: `The length is not a number, max = ${
                page === 1000 ? 6000 : 1024
              }`,
            },
          ]}
        >
          <InputNumber
            type="number"
            defaultValue={item.length}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="Data Address"
          name="address"
          rules={[
            { required: true, message: 'please input data address' },
            {
              type: 'number',
              max: page === 1000 ? 65535 : 65535,
              message: `The data address is not a number, max = ${
                page === 1000 ? 65535 : 65535
              }`,
            },
          ]}
        >
          <InputNumber
            type="number"
            defaultValue={item.address}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Data Address Offset" name="dataAddrOffset">
          <InputNumber
            defaultValue={item.dataAddrOffset}
            style={{ width: '100%' }}
            disabled={!isVisible}
          />
        </Form.Item>
        <Form.Item
          label="Number of Device"
          name="numberOfDevice"
          rules={[
            { required: false, message: 'please input number of device' },
            {
              type: 'number',
              max: 40,
              message: `The number of device is not a number, max = 40`,
            },
          ]}
        >
          <InputNumber
            defaultValue={item.numberOfDevice}
            style={{ width: '100%' }}
            disabled={!isVisible}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default wrappedMapModal;
