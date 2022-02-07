import React, { ReactElement, useEffect, useState } from 'react';
import { Row, Col, Button, Modal, Input, List } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import WrappedElement from '@src/Data/WrappedElement';
import { modalGlobalConfig } from 'antd/lib/modal/confirm';
import IpcService from '@src/main/IPCService';
import { REQ_CREATE_FILE, REQ_LOAD_FILE, REQ_SEND_TO_DEVICE } from '@src/ipcChannels';
import { ChannelRequestCreateFile, WrappedFileCreateProps } from '@src/main/ipc/ChannelRequestCreateFile';
import { WrappedFileLoadProps } from '@src/main/ipc/ChannelRequestLoadFile';
import { ChannelSendToDeviceProps } from '@src/main/ipc/ChannelSendToDevice';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [length, setLength] = useState('');
  const [wrappedAdd, setWrappedAdd] = useState('');
  const [elements, setElements] = useState<Array<WrappedElement>>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loadFilePath, setLoadFilePath] = useState('');
  const showModal = () => {
    setIsModalVisible(true);
  };
  const insertElement = (item: WrappedElement) => {
    setElements((prevList) => {
      if (prevList === undefined){
        console.log("list is null");
      }
      return [...prevList, item];
    });

  }
  const handleSaveButton = async () => {
    const service = IpcService.getInstance();
    await service.send<boolean, WrappedFileCreateProps>(REQ_CREATE_FILE, {
      elements, 
      fileType: 1,
    });
  }

  const handleLoadButton = async () => {
    const service = IpcService.getInstance();
    const {filePath ,result, elements: loadElements}  = await service.send<{result: boolean, elements: WrappedElement[], filePath:string}, WrappedFileLoadProps>(REQ_LOAD_FILE,{})

    if (result) {
      setElements(loadElements);
      setLoadFilePath(filePath);
      console.log(filePath);
    }
  }

  const handleSendFileButton = async () => {
    const service = IpcService.getInstance();
    await service.send<boolean, ChannelSendToDeviceProps>(REQ_SEND_TO_DEVICE, {
      filePath: loadFilePath,
    });
  }
  const handleOk = (index : number) => {
    setIsModalVisible(false);
    if (index < 0) {
      const item = new WrappedElement();
      item.address = parseInt(address, 10);
      item.length = parseInt(length, 10);
      item.page = 1000;
      item.wrappedAddress = parseInt(wrappedAdd, 10);
      insertElement(item);
  
      setAddress("");
      setLength("");
      setWrappedAdd("");
    } else {
      const item = elements[index];
      item.address = parseInt(address, 10);
      item.length = parseInt(length, 10);
      item.page = 1000;
      item.wrappedAddress = parseInt(wrappedAdd, 10);
      setElements(elements);
    }
   
  };

  const handleCancel = () => {
    setIsModalVisible(false);    
    setAddress("");
    setLength("");
    setWrappedAdd("");
  };
  
  const itemClickHandle = (index: number) => {
    if (index !== selectedIndex) {
      setSelectedIndex(index);
    } else {
      setSelectedIndex(-1);
    }
  }

  const itemDoubleClickHandle=(index: number)=>{
    setSelectedIndex(index);
    const item = elements[index];
    setAddress(item.address.toString());
    setLength(item.length.toString());
    setWrappedAdd(item.wrappedAddress.toString());
    showModal();
    console.log(`selected item index ${index}`);
  }

  const removeElement=()=>{
    setElements(elements.filter(item => item.address !== elements[selectedIndex].address));
  }
  return (
    <>
      <Row justify="start">
        <Col>
          <UserButton onClick={handleSaveButton}>Save</UserButton>
        </Col>
        <Col>
          <UserButton onClick ={handleLoadButton}>Load</UserButton>
        </Col>
        <Col>
          <UserButton onClick ={handleSendFileButton}>File Send</UserButton>
        </Col>
        <Col>
          <UserButton
            type="text"
            icon={<PlusCircleOutlined />}
            onClick={showModal}
          />
          <Modal
            title="Creat Element"
            visible={isModalVisible}
            onOk={() => handleOk(selectedIndex)}
            onCancel={handleCancel}
            destroyOnClose
          >
            <Row>
              <Col flex={1.5}>
                <Label>Address</Label>
              </Col>
              <Col flex={3.5}>
                <Input
                  size="small"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col flex={1.5}>
                <Label>Length</Label>
              </Col>
              <Col flex={3.5}>
                <Input
                  size="small"
                  value = {length}
                  onChange={(e) => setLength(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col flex={1.5}>
                <Label>Page</Label>
              </Col>
              <Col flex={3.5}>
                <Input size="small" value={1000} disabled />
              </Col>
            </Row>
            <Row>
              <Col flex={1.5}>
                <Label>Wrapped Address</Label>
              </Col>
              <Col flex={3.5}>
                <Input
                  size="small"
                  value ={wrappedAdd}
                  onChange={(e) => setWrappedAdd(e.target.value)}
                />
              </Col>
            </Row>
          </Modal>
        </Col>
        <Col span={1}>
          <UserButton type="text" icon={<MinusCircleOutlined />} onClick={removeElement}/>
        </Col>
      </Row>
      <Row>
      <List
      size="small"
      bordered
      dataSource={elements}
      renderItem={(item,index) =>         
        <List.Item> 
          <FileItemContainer selected={index === selectedIndex} onDoubleClick={() => itemDoubleClickHandle(index)} onClick={() => itemClickHandle(index)}>
            <Label>Address : {item.address}</Label>
            <Label>({item.wrappedAddress})</Label>        
            <Label>[{item.length}]</Label>
          </FileItemContainer>
        </List.Item>}
    />
      </Row>
    </>
  );
}
