import React, { ReactElement, useEffect, useState } from 'react';
import { Row, Col, Button, Modal, Input, List, Divider } from 'antd';
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
import WrappedMapModal from './wrappedMapModal';

const Label = styled.p`
  text-align: left;
  font-size: 9pt;
  min-width: 50px;
  width: 100px;
`;
const FileItemContainer = styled.div<{ selected: boolean }>`
  display: flex;
  background-color: ${(props) => (props.selected ? '#b8d4ebc0' : '#f4f4f4')};
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  min-width: 350px;
  height: 55px;
  :hover {
    background-color: #bababac0;
  }
  :active {
    background-color: #686868;
  }
`;
const UserButton = styled(Button)`
  margin-right: 10px;
`;
export default function WrappedMapContents(): ReactElement {
  const [isCoilModalVisible, setIsCoilModalVisible] = useState(false);
  const [isRegModalVisible, setIsRegModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [length, setLength] = useState('');
  const [wrappedAdd, setWrappedAdd] = useState('');
  const [mapPage, setPage] = useState(0);
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
    const path = type === 1 ? coilLoadFilePath : regLoadFilePath;
    await service.send<boolean, ChannelSendToDeviceProps>(REQ_SEND_TO_DEVICE, {
      filePath: path,
      fileType: type
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
    setPage(page);
    console.log(`${add}, ${leng}, ${wAdd}`);

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
  }

  return (
    <Row>
      <Col>
        <Row justify="start">
          <Col>
            <UserButton onClick={(e) => handleSaveButton(1)}>
              Coil file Save
            </UserButton>
          </Col>
          <Col>
            <UserButton onClick={(e) => handleLoadButton(1)}>
              Coil file Load
            </UserButton>
          </Col>
          <Col>
            <UserButton onClick={(e) => handleSendFileButton(1)}>
              Coil File Send
            </UserButton>
          </Col>
          <Col>
            <UserButton
              type="text"
              icon={<PlusCircleOutlined />}
              onClick={(e) => {
                setCoilSelectedIndex(-1);
                showModal(1);
              }}
            />
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
          <Col span={1}>
            <UserButton
              type="text"
              icon={<MinusCircleOutlined />}
              onClick={(e) => removeElement(1)}
            />
          </Col>
        </Row>
        <Row>
          <List
            size="small"
            bordered
            dataSource={coilElements}
            renderItem={(item, index) => (
              <List.Item>
                <FileItemContainer
                  selected={index === coilSelectedIndex}
                  onDoubleClick={() => itemDoubleClickHandle(index, 1)}
                  onClick={() => itemClickHandle(index, 1)}
                >
                  <Label>Address : {item.address}</Label>
                  <Label>({item.wrappedAddress})</Label>
                  <Label>[{item.length}]</Label>
                </FileItemContainer>
              </List.Item>
            )}
          />
        </Row>
      </Col>

      <Col>
        <Row justify="start">
          <Col>
            <UserButton onClick={(e) => handleSaveButton(2)}>
              Reg file Save
            </UserButton>
          </Col>
          <Col>
            <UserButton onClick={(e) => handleLoadButton(2)}>
              Reg file Load
            </UserButton>
          </Col>
          <Col>
            <UserButton onClick={(e) => handleSendFileButton(2)}>
              Reg File Send
            </UserButton>
          </Col>
          <Col>
            <UserButton
              type="text"
              icon={<PlusCircleOutlined />}
              onClick={(e) => {
                setRegSelectedIndex(-1);
                showModal(2);
              }}
            />
            <WrappedMapModal
              isModalVisible={isRegModalVisible}
              onOk={handleOk}
              onCancel={() => handleCancel(2)}
              selectedIndex={regSelectedIndex}
              page={0}
              close={closeRequest}
              item={regElements[regSelectedIndex] ?? new WrappedElement()}
            />
          </Col>
          <Col span={1}>
            <UserButton
              type="text"
              icon={<MinusCircleOutlined />}
              onClick={(e) => removeElement(2)}
            />
          </Col>
        </Row>
        <Row>
          <List
            size="small"
            bordered
            dataSource={regElements}
            renderItem={(item, index) => (
              <List.Item>
                <FileItemContainer
                  selected={index === regSelectedIndex}
                  onDoubleClick={() => itemDoubleClickHandle(index, 2)}
                  onClick={() => itemClickHandle(index, 2)}
                >
                  <Label>Address : {item.address}</Label>
                  <Label>({item.wrappedAddress})</Label>
                  <Label>[{item.length}]</Label>
                </FileItemContainer>
              </List.Item>
            )}
          />
        </Row>
      </Col>
    </Row>
  );
}
