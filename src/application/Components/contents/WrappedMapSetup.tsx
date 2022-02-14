import React, { ReactElement, useState } from 'react';
import { Row, Col, Button, Table, Space } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import WrappedElement from '@src/Data/WrappedElement';
import IpcService from '@src/main/IPCService';
import {
  REQ_CREATE_FILE,
  REQ_LOAD_FILE,
  REQ_SEND_TO_DEVICE,
} from '@src/ipcChannels';
import { WrappedFileCreateProps } from '@src/main/ipc/ChannelRequestCreateFile';
import { WrappedFileLoadProps } from '@src/main/ipc/ChannelRequestLoadFile';
import { ChannelSendToDeviceProps } from '@src/main/ipc/ChannelSendToDevice';
import WrappedMapModal from './WrappedMapModal';
import './index.css';
import Title from '../Title';

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
    title: 'user address',
    dataIndex: 'wrappedAddress',
    key: 'wrappedAddress',
  },
  {
    title: 'data length',
    dataIndex: 'length',
    key: 'length',
  },
  {
    title: 'data address',
    dataIndex: 'address',
    key: 'address',
  },
];

export default function WrappedMapContents(): ReactElement {
  const [isCoilModalVisible, setIsCoilModalVisible] = useState(false);
  const [isRegModalVisible, setIsRegModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [length, setLength] = useState('');
  const [wrappedAdd, setWrappedAdd] = useState('');
  const [coilElements, setCoilElements] = useState<Array<WrappedElement>>([]);
  const [coilSelectedIndex, setCoilSelectedIndex] = useState(-1);
  const [regElements, setRegElements] = useState<Array<WrappedElement>>([]);
  const [regSelectedIndex, setRegSelectedIndex] = useState(-1);
  const [coilLoadFilePath, setCoilLoadFilePath] = useState('');
  const [regLoadFilePath, setRegLoadFilePath] = useState('');

  const showModal = (type: number) => {
    if (type === 1) setIsCoilModalVisible(true);
    else setIsRegModalVisible(true);
  };

  const insertElement = (item: WrappedElement) => {
    if (item.page === 1000) {
      setCoilElements((prevList) => {
        if (prevList === undefined) {
          console.log('list is null');
        }
        return [...prevList, item];
      });
    } else {
      setRegElements((prevList) => {
        if (prevList === undefined) {
          console.log('list is null');
        }
        return [...prevList, item];
      });
    }
  };

  const handleSaveButton = async (type: number) => {
    const service = IpcService.getInstance();
    const elements = type === 1 ? coilElements : regElements;
    await service.send<boolean, WrappedFileCreateProps>(REQ_CREATE_FILE, {
      elements,
      fileType: type,
    });
  };

  const handleLoadButton = async (type: number) => {
    const service = IpcService.getInstance();
    const {
      filePath,
      result,
      elements: loadElements,
    } = await service.send<
      { result: boolean; elements: WrappedElement[]; filePath: string },
      WrappedFileLoadProps
    >(REQ_LOAD_FILE, {});

    if (result) {
      if (type === 1) {
        setCoilElements(loadElements);
        setCoilLoadFilePath(filePath);
      } else {
        setRegElements(loadElements);
        setRegLoadFilePath(filePath);
      }
    }
  };

  const handleSendFileButton = async (type: number) => {
    const service = IpcService.getInstance();
    await service.send<boolean, ChannelSendToDeviceProps>(REQ_SEND_TO_DEVICE, {
      fileType: type,
      elements: type === 1 ? coilElements : regElements 
    });
  };

  const handleOk = (
    index: number,
    add: string,
    leng: string,
    wAdd: string,
    page: number,
  ) => {
    if (page === 1000) {
      setIsCoilModalVisible(false);
    } else {
      setIsRegModalVisible(false);
    }

    setAddress(add);
    setLength(leng);
    setWrappedAdd(wAdd);

    if (index < 0) {
      const item = new WrappedElement();
      item.address = parseInt(add, 10);
      item.length = parseInt(leng, 10);
      item.page = page;
      item.wrappedAddress = parseInt(wAdd, 10);
      console.log(`${address}, ${length}, ${wrappedAdd}`);
      insertElement(item);

      setAddress('');
      setLength('');
      setWrappedAdd('');
    } else if (page === 1000) {
      const item = coilElements[index];
      item.address = parseInt(add, 10);
      item.length = parseInt(leng, 10);
      item.page = page;
      item.wrappedAddress = parseInt(wAdd, 10);
      setCoilElements(coilElements);
    } else {
      const item = regElements[index];
      item.address = parseInt(add, 10);
      item.length = parseInt(leng, 10);
      item.page = page;
      item.wrappedAddress = parseInt(wAdd, 10);
      setRegElements(regElements);
    }
  };

  const handleCancel = (type: number) => {
    if (type === 1) {
      setIsCoilModalVisible(false);
    } else {
      setIsRegModalVisible(false);
    }
    setAddress('');
    setLength('');
    setWrappedAdd('');
  };

  const itemClickHandle = (index: number, type: number) => {
    console.log(index, type);
    if (type === 1) {
      if (index !== coilSelectedIndex) {
        setCoilSelectedIndex(index);
      } else {
        setCoilSelectedIndex(-1);
      }
    } else if (index !== regSelectedIndex) {
      setRegSelectedIndex(index);
    } else {
      setRegSelectedIndex(-1);
    }
  };

  const itemDoubleClickHandle = (index: number, type: number) => {
    if (type === 1) setCoilSelectedIndex(index);
    else setRegSelectedIndex(index);

    const item = type === 1 ? coilElements[index] : regElements[index];
    setAddress(item.address.toString());
    setLength(item.length.toString());
    setWrappedAdd(item.wrappedAddress.toString());
    showModal(type);

    setAddress('');
    setLength('');
    setWrappedAdd('');

    console.log(`selected item index ${index}`);
  };

  const removeElement = (type: number) => {
    if (type === 1)
      setCoilElements(
        coilElements.filter(
          (item) => item.address !== coilElements[coilSelectedIndex].address,
        ),
      );
    else
      setRegElements(
        regElements.filter(
          (item) => item.address !== regElements[regSelectedIndex].address,
        ),
      );
  };

  const closeRequest = () => {
    setIsCoilModalVisible(false);
    setIsRegModalVisible(false);
  };

  return (
    <Row>
      <Col>
        <Space
          direction="vertical"
          style={{ width: '95%', marginBottom: 30 }}
          size="middle"
        >
          <Title> User Define Address Map (Coil) </Title>
          <Row>
            <UserButton onClick={(e) => handleSaveButton(1)}>
              Save File
            </UserButton>
            <UserButton onClick={(e) => handleLoadButton(1)}>
              Load File
            </UserButton>
            <UserButton onClick={(e) => handleSendFileButton(1)}>
              Send File
            </UserButton>
            <UserButton
              type="text"
              icon={<PlusCircleOutlined />}
              onClick={(e) => {
                setCoilSelectedIndex(-1);
                showModal(1);
              }}
            />
            <UserButton
              type="text"
              icon={<MinusCircleOutlined />}
              onClick={(e) => removeElement(1)}
            />
          </Row>
          <Row justify="start">
            <Table
              rowClassName={(record, index) => {
                if (coilSelectedIndex === index) {
                  return 'blue-color';
                }
                return '';
              }}
              dataSource={coilElements}
              columns={columns}
              size="small"
              scroll={{ y: 500 }}
              onRow={(record, rowIndex) => ({
                onDoubleClick: (event) => {
                  itemDoubleClickHandle(rowIndex, 1);
                },
                onClick: () => {
                  itemClickHandle(rowIndex, 1);
                },
              })}
            />
          </Row>
          <Row justify="start">
            <Col>
              <WrappedMapModal
                isModalVisible={isCoilModalVisible}
                onOk={handleOk}
                onCancel={() => handleCancel(1)}
                selectedIndex={coilSelectedIndex}
                page={1000}
                close={closeRequest}
                item={coilElements[coilSelectedIndex] ?? new WrappedElement()}
              />
            </Col>
          </Row>
        </Space>
      </Col>
      <Col>
        <Space
          direction="vertical"
          style={{ width: '95%', marginBottom: 30 }}
          size="middle"
        >
          <Title> User Define Address Map (Register) </Title>
          <Row>
            <UserButton onClick={(e) => handleSaveButton(2)}>
              Save File
            </UserButton>
            <UserButton onClick={(e) => handleLoadButton(2)}>
              Load File
            </UserButton>
            <UserButton onClick={(e) => handleSendFileButton(2)}>
              Send File
            </UserButton>
            <UserButton
              type="text"
              icon={<PlusCircleOutlined />}
              onClick={(e) => {
                setRegSelectedIndex(-1);
                showModal(2);
              }}
            />

            <UserButton
              type="text"
              icon={<MinusCircleOutlined />}
              onClick={(e) => removeElement(2)}
            />
          </Row>
          <Row justify="start">
            <Table
              rowClassName={(record, index) => {
                if (regSelectedIndex === index) {
                  return 'blue-color';
                }
                return '';
              }}
              dataSource={regElements}
              columns={columns}
              size="small"
              scroll={{ y: 500 }}
              onRow={(record, rowIndex) => ({
                onDoubleClick: (event) => {
                  itemDoubleClickHandle(rowIndex, 2);
                },
                onClick: () => {
                  itemClickHandle(rowIndex, 2);
                },
              })}
            />
          </Row>
          <Row>
            <WrappedMapModal
              isModalVisible={isRegModalVisible}
              onOk={handleOk}
              onCancel={() => handleCancel(2)}
              selectedIndex={regSelectedIndex}
              page={0}
              close={closeRequest}
              item={regElements[regSelectedIndex] ?? new WrappedElement()}
            />
          </Row>
        </Space>
      </Col>
    </Row>
  );
}
