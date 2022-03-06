import { Tabs } from 'antd';
import React, { ReactElement, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import UserSelect from '@src/application/Components/Shared/Select';
import Input from '../Shared/Input/Input';

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
  const [targetValue, setTargetValue] = useState('');
  const { control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      setupValue: 'test',
    },
  });
  const submit = (values: FormValues) => {
    console.log(`submit value = ${values.setupValue}`);
    setTargetValue(values.setupValue);
  };

  return (
    <div>
      <Tabs type="card">
        <TabPane tab="TEST" key="1">
          <form onSubmit={handleSubmit(submit)} style={{ height: '500px' }}>
            <Input
              name="setupValue"
              defaultValue={targetValue}
              label="test"
              width="130px"
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
      </Tabs>
    </div>
  );
}
