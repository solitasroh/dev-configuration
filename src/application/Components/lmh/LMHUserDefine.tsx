import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import UserDefineIOData, { DefinedIO } from '@src/Data/UserDefineIOData';
import { Button, Form, Input, InputNumber, Modal, Row, Select, Table } from 'antd';
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';

const UserButton = styled(Button)`
  margin-right: 10px;
`;
interface columnDef {
  title: string;
  dataIndex: string;
  key: string;
}

const columns: columnDef[] = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Mapping',
    dataIndex: 'mapping',
    key: 'mapping',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
];
export default function LMHUserDefine(): ReactElement {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemList, setItemList] = useState<DefinedIO[]>([]);
  const [myForm] = Form.useForm();

  const options = [
    { label: 'Disable', value: 0 },
    { label: 'Digital Input', value: 1 },
    { label: 'Digital Output', value: 2 },
    { label: 'Analog Input', value: 3 },
    { label: 'Analog Output', value: 4 },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };
  const onCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values: any) => {
    setIsModalVisible(false);
    console.log(values);
    const i = itemList.length - 1;
    const item = itemList[i];

    const data: DefinedIO = {
      key: item?.key + 1,
      type: values.type,
      mapping: values.mapping,
      name: values.name,
    };

    setItemList((prev) => [...prev, data]);

    myForm.resetFields();
  };

  return (
    <div>
      <UserButton
        type="text"
        icon={<PlusCircleOutlined />}
        onClick={(e) => {
          showModal();
        }}
      />
      <UserButton type="text" icon={<MinusCircleOutlined />} />
      <Row justify="start">
        <Table
          dataSource={itemList}
          columns={columns}
          size="small"
          scroll={{ y: 500 }}
        />
      </Row>
      <Modal
        title="user define DIO Setup"
        visible={isModalVisible}
        destroyOnClose
        footer={[
          <Button form="myUserDefineForm" key="submit" htmlType="submit">
            Submit
          </Button>,
          <Button key="cancel" onClick={() => onCancel()}>
            Cancel
          </Button>,
        ]}
      >
        <Form
          id="myUserDefineForm"
          form={myForm}
          name="userDefineIO"
          onFinish={onFinish}
          layout="vertical"
          size="small"
        >
          <Form.Item label="Type" name="type">
            <Select
              options={options}
              size="small"
            />
          </Form.Item>
          <Form.Item label="Mapping" name="mapping">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Name" name="name">
            <Input type="text" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
