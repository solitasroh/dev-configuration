import React, { ReactElement, useState } from 'react';
import { Row, Col, Button, Table, Space } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import WrappedElement from '@src/Data/WrappedElement';
import IpcService from '@src/main/IPCService';
import {
  REQ_CREATE_FILE,
  REQ_LOAD_FILE,
  REQ_READ_TO_DEVICE,
  REQ_SEND_TO_DEVICE,
} from '@src/ipcChannels';
import { WrappedFileCreateProps } from '@src/main/ipc/ChannelRequestCreateFile';
import { WrappedFileLoadProps } from '@src/main/ipc/ChannelRequestLoadFile';
import { ChannelSendToDeviceProps } from '@src/main/ipc/ChannelSendToDevice';
import WrappedMapModal from './WrappedMapModal';
import './index.css';
import Title from '../Title';
import { ChannelReadToDeviceProps } from '@src/main/ipc/ChannelReadToDevice';

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
  const [selectedItem, setSelectedItem] = useState(null);

  const [coilLoadFilePath, setCoilLoadFilePath] = useState('');
  const [regLoadFilePath, setRegLoadFilePath] = useState('');

  const showModal = (type: number) => {
    if (type === 1) setIsCoilModalVisible(true);
    else setIsRegModalVisible(true);
  };

  const insertElement = (item: WrappedElement) => {
    if (item.page === 1000) {
      console.log('coils length = ', coilElements.length);
      if (coilElements.length > 0) {
        const maxkey = coilElements.reduce((max, obj) =>
          parseInt(max.key, 10) > parseInt(obj.key, 10) ? max : obj,
        );
        console.log(parseInt(maxkey.key, 10));
        item.setKey(`${parseInt(maxkey.key, 10) + 1}`);
      } else {
        item.setKey('0');
      }

      setCoilElements((prevList) => {
        if (prevList === undefined) {
          console.log('list is null');
        }
        return [...prevList, item];
      });
    } else {
      if (regElements.length > 0) {
        const maxkey = regElements.reduce((max, obj) =>
          parseInt(max.key, 10) > parseInt(obj.key, 10) ? max : obj,
        );
        item.setKey(`${maxkey.key + 1}`);
      } else {
        item.setKey('0');
      }

      setRegElements((prevList) => {
        if (prevList === undefined) {
          console.log('list is null');
        }
        return [...prevList, item];
      });
    }
  };

  const insertElements = (type: number, elements: WrappedElement[]) => {
    if (type === 2) {
      setCoilElements((prevList) => {
        if (prevList === undefined) {
          console.log('list is null');
        }
        return [...prevList, ...elements];
      });
    } else {
      setRegElements((prevList) => {
        if (prevList === undefined) {
          console.log('list is null');
        }
        return [...prevList, ...elements];
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
      elements: type === 1 ? coilElements : regElements,
    });
  };

  const handleReadButton = async (type: number) => {
    const service = IpcService.getInstance();
    const { result, elements: readElements } = await service.send<
      { result: boolean; elements: WrappedElement[]; filePath: string },
      ChannelReadToDeviceProps
    >(REQ_READ_TO_DEVICE, { fileType: type });

    if (result) {
      if (type === 2) {
        setCoilElements(readElements);
      } else {
        setRegElements(readElements);
      }
    }
  };

  const getMaxKey = (page: number): number => {
    try {
      if (page === 1000) {
        const maxkey = coilElements.reduce((max, obj) =>
          parseInt(max.key, 10) > parseInt(obj.key, 10) ? max : obj,
        ).key;
        const key = parseInt(maxkey, 10);
        return key;
      }

      const maxkey = regElements.reduce((max, obj) =>
        parseInt(max.key, 10) > parseInt(obj.key, 10) ? max : obj,
      ).key;
      const key = parseInt(maxkey, 10);
      return key;
    } catch (err) {
      return 0;
    }
  };
  const handleOk = (
    index: number,
    add: string,
    leng: string,
    wAdd: string,
    dataAddrOffset: string,
    userAddrOffset: string,
    numD: string,
    enable: boolean,
    page: number,
  ) => {
    let type = 0;
    if (page === 1000) {
      setIsCoilModalVisible(false);
      type = 2;
    } else {
      setIsRegModalVisible(false);
      type = 1;
    }
    console.log('handle ok add address', add);
    setAddress(add);
    setLength(leng);
    setWrappedAdd(wAdd);

    if (index < 0) {
      console.log(index);

      if (enable === true) {
        const array = [];
        let key = getMaxKey(page);

        for (let i = 0; i < parseInt(numD, 10); i += 1) {
          const item = new WrappedElement();
          item.address = parseInt(add, 10) + i * parseInt(dataAddrOffset, 10);
          item.length = parseInt(leng, 10);
          item.page = page;
          item.wrappedAddress =
            parseInt(wAdd, 10) + i * parseInt(userAddrOffset, 10);

          key += 1;
          item.key = key.toString();

          array.push(item);
        }
        insertElements(type, array);
      } else {
        const item = new WrappedElement();
        item.address = parseInt(add, 10);
        item.length = parseInt(leng, 10);
        item.page = page;
        item.wrappedAddress = parseInt(wAdd, 10);
        console.log(`${address}, ${length}, ${wrappedAdd}`);
        insertElement(item);
      }

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

    setCoilSelectedIndex(-1);
    setRegSelectedIndex(-1);
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
    setCoilSelectedIndex(-1);
    setRegSelectedIndex(-1);
  };

  const itemClickHandle = (item: WrappedElement, type: number) => {
    if (type === 1) {
      if (selectedItem === item) {
        setSelectedItem(null);
        setCoilSelectedIndex(-1);
      } else {
        setSelectedItem(item);
        setCoilSelectedIndex(coilElements.indexOf(item));
      }
    } else if (type === 2) {
      if (selectedItem === item) {
        setSelectedItem(null);
        setRegSelectedIndex(-1);
      } else {
        setSelectedItem(item);
        setRegSelectedIndex(regElements.indexOf(item));
      }
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
    if (type === 1) {
      if (selectedItem !== null) {
        setCoilElements(coilElements.filter((item) => item !== selectedItem));
      }
    } else if (selectedItem !== null) {
      setRegElements(
        regElements.filter(
          (item) => item.address !== regElements[regSelectedIndex].address,
        ),
      );
    }

    setCoilSelectedIndex(-1);
    setRegSelectedIndex(-1);
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
            <UserButton onClick={(e) => handleReadButton(2)}>
              Read File
            </UserButton>
            <UserButton
              type="text"
              icon={<PlusCircleOutlined />}
              onClick={(e) => {
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
                  itemClickHandle(record, 1);
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
            <UserButton onClick={(e) => handleReadButton(1)}>
              Read File
            </UserButton>
            <UserButton
              type="text"
              icon={<PlusCircleOutlined />}
              onClick={(e) => {
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
                  itemClickHandle(record, 2);
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
