import { Tabs } from 'antd';
import React, { ReactElement, useState } from 'react';
import Select from 'react-select';
import { Controller, useForm } from 'react-hook-form';
import Input from '../Shared/Input/Input';
import UserInput from '../UserInput';
import UserSelect from '../UserSelect';

const { TabPane } = Tabs;
const elements = [
  { key: '1', value: '1', name: 'lolo' },
  { key: '2', value: '2', name: '2lolo' },
];
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];
type FormValues = {
  setupValue: string;
};

export default function Home(): ReactElement {
  const [ref, setRef] = useState('0');
  const [value, setValue] = useState(0);
  const { control, handleSubmit } = useForm<FormValues>();
  const submit = (values: FormValues) => {
    const newValue = values.setupValue;
    setRef(newValue);
  };
  return (
    <div>
      <Tabs type="card">
        <TabPane tab="TEST" key="1">
          <form onSubmit={handleSubmit(submit)}>
            <Controller
              name="setupValue"
              render={({ field: { onChange, value: v } }) => (
                <Input
                  label="test"
                  value={v}
                  refValue={ref}
                  onChange={onChange}
                  width="80px"
                />
              )}
              control={control}
            />
            <Select options={options} />
            <input type="submit" value="Apply" />
          </form>
        </TabPane>

        <TabPane tab="Input Box" key="2">
          <UserInput
            label="input"
            value={value}
            onChange={(v) => setValue(v)}
          />
          <div>{value}</div>
        </TabPane>
        <TabPane tab="Select Box" key="3">
          <UserSelect elements={elements} />
        </TabPane>
      </Tabs>
    </div>
  );
}
