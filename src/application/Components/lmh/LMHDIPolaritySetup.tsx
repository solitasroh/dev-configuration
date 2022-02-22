import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Form, Input, Select, Space } from 'antd';
import LMHLogicSetup, { LogicIOProps } from '@src/Data/LMHLogicSetup';
import styled from 'styled-components';
import IpcService from '@src/main/IPCService';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';
import { WRITE_REQ } from '@src/ipcChannels';
import { useOncePolling } from '@src/application/hooks/ipcHook';
import LMManagementSetup from '@src/Data/LMHManageSetup';

const Label = styled.p`
  width: 110px;
  text-align: left;
  font-size: 10pt;
`;
const data = new LMHLogicSetup(18);
export default function DIPolaritySetup(): ReactElement {
  const [list, setList] = useState<LogicIOProps[]>(data.detail);
  const [myForm] = Form.useForm();

  const setPolarityState = (Status: number): string => {
    if (Status === 1) return 'Normal';
    if (Status === 2) return 'Reverse';
    return 'None';
  };
  const options = [
    { label: 'None', value: 0 },
    { label: 'Normal', value: 1 },
    { label: 'Reverse', value: 2 },
  ];

  useEffect(() => {
    useOncePolling(
      {
        requestType: 'LMLogicSetup',
        responseChannel: 'POLL-LM-LOGIC-SETUP',
      },
      (evt, resp) => {
        const data = resp as LMHLogicSetup;

        setList((prev) => [...data.detail]);

        // console.log(`logic setup polling`);
        // console.log(myForm.getFieldsValue());
        // console.log(data);
      },
    );
  }, []);

  useEffect(() => {
    console.log('list detail set..');
    console.log(list);
    myForm.setFieldsValue(list);
  }, [list]);

  const finished = (values: any) => {
    const setup = new LMHLogicSetup(18);
    values.detail.map(
      (v: { diPolarity: number; diMapping: number }, index: number) => {
        setup.detail[index].diPolarity = parseInt(v.diPolarity.toString(), 10);
        setup.detail[index].diMapping = parseInt(v.diMapping.toString(), 10);
      },
    );

    console.log(values);
    console.log(setup);

    const service = IpcService.getInstance();
    service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
      writeData: setup,
      requestType: 'LMLogicSetup',
    });
  };

  return (
    <Space>
      <Form
        style={{ display: 'flex', flexDirection: 'column' }}
        id="myForm"
        form={myForm}
        onFinish={finished}
      >
        <Form.Item>
          <Button htmlType="submit">Accept</Button>
        </Form.Item>
        <Form.List name="detail" initialValue={list}>
          {(fields) =>
            fields.map((field, index) => {
              console.log(field);
              return (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {/*<Form.Item*/}
                  {/*  {...field}*/}
                  {/*  style={{ marginRight: '10px' }}*/}
                  {/*  name={[field.name, 'diPolarity']}*/}
                  {/*  label={`DI ${index + 1} polarity`}*/}
                  {/*>*/}
                  {/*  <Select style={{ width: 120 }} options={options} />*/}
                  {/*</Form.Item>*/}
                  <Form.Item
                    {...field}
                    style={{ marginRight: '10px' }}
                    // name={[field.name, 'diMapping']}
                    label={`DI ${index + 1} mapping`}
                    key={field.key}
                  >
                    <Input style={{ width: 120 }} value={field.key} />
                  </Form.Item>
                </div>
              );
            })
          }
        </Form.List>
        {/* {list?.detail?.map((data, index) => (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Form.Item name={`polarity${index + 1}`} label={`ch ${index + 1}`}>
              <Select
                style={{ width: 120 }}
                options={options}
                value={data.diMappingPolarity}
                defaultValue={data.diMappingPolarity}
              />
            </Form.Item>
            <Form.Item name={`input${index + 1}`}>
              <Input
                style={{ width: 120 }}
                value={data.doMapping}
                defaultValue={data.doMapping}
              />
            </Form.Item>
          </div>
        ))} */}
      </Form>
    </Space>
  );
}
