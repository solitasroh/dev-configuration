import { Tabs } from 'antd';
import React, { ReactElement, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import UserSelect from '@src/application/Components/Shared/Select';
import Input from '../Shared/Input/Input';
import UserInput from '../UserInput';

const { TabPane } = Tabs;

const options = [
  { label: 'label1', value: '1' },
  { label: 'label2', value: '2' },
];
type FormValues = {
  setupValue: string;
  selectValue: string;
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
          <form onSubmit={handleSubmit(submit)} style={{ height: '500px' }}>
            <Controller
              name="setupValue"
              render={({ field: { onChange, value: v } }) => (
                <Input
                  label="test"
                  value={v}
                  refValue={ref}
                  onChange={onChange}
                  width="130px"
                />
              )}
              control={control}
            />
            <Controller
              name="selectValue"
              render={({ field: { onChange, value: v } }) => (
                <UserSelect
                  width="130px"
                  options={options}
                  onChange={onChange}
                  value={v}
                  label="test"
                />
              )}
              control={control}
            />

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
      </Tabs>
    </div>
  );
}
