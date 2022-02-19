import { Form, Input, Modal } from 'antd';
import React, { FC } from 'react';

type ConnProp = {
  ipAddress: string;
  visible: boolean;
  confirmLoading: boolean;
  onConnect: (values: string) => void;
  onCancel: () => void;
};

const ConnectionForm: FC<ConnProp> = ({
  ipAddress,
  visible,
  confirmLoading,
  onConnect,
  onCancel,
}: ConnProp) => {
  const [form] = Form.useForm();
  const handleConnection = () => {
    form.validateFields().then(({ inputIpAddress }) => {
      form.resetFields();
      onConnect(inputIpAddress);
    });
  };

  return (
    <Modal
      title="Connect to A2700 device"
      centered
      visible={visible}
      okText="Connect"
      cancelText="Cancel"
      confirmLoading={confirmLoading}
      onOk={handleConnection}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="inputIpAddress"
          label="Ip Address"
          rules={[
            {
              required: true,
              message: 'Please input the ip address',
            },
            {
              pattern:
                /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
              message: 'ip address is invalid',
            },
          ]}
        >
          <Input value={ipAddress} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConnectionForm;
