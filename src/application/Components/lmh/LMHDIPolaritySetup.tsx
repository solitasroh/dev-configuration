import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Form, Input, Select, Space } from 'antd';
import LMHLogicSetup from '@src/Data/LMHLogicSetup';
import styled from 'styled-components';

const Label = styled.p`
  width: 110px;
  text-align: left;
  font-size: 10pt;
`;
export default function DIPolaritySetup(): ReactElement {
  const [list, setList] = useState<LMHLogicSetup>(new LMHLogicSetup(18));
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
  const finished = (values:any) => {
    const setup = new LMHLogicSetup(18);
    values.formList.map((v: { diMappingPolarity: number; doMapping: number; },index: number) => {
      setup.detail[index].diMappingPolarity = parseInt(v.diMappingPolarity.toString(),10);
      setup.detail[index].doMapping = parseInt(v.doMapping.toString(), 10);
    });
    console.log(values);
    console.log(setup);
    
    
  };
  
  myForm.setFieldsValue(list.detail);

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
        <Form.List name="formList" initialValue={list.detail}>
          {(fields) => (
            fields.map((field) => (
              <>
                <Form.Item {...field} name={[field.name, 'diMappingPolarity']}>
                  <Select
                    style={{ width: 120 }}
                    options={options}
                  />
                </Form.Item>
                <Form.Item {...field} name={[field.name, 'doMapping']}>
                  <Input
                    style={{ width: 120 }}
                  />
                </Form.Item>
              </>
            ))
          )}
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
