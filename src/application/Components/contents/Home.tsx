import { Tabs } from 'antd';
import React, { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select, {
  SelectOptionType,
} from '@src/application/Components/Shared/Select';
import NumberInput from '../Shared/NumberInput';
import { InputValueType } from '@src/application/Components/Shared/Shared';

const { TabPane } = Tabs;

const options: SelectOptionType[] = [
  { label: 'label1', value: 1 },
  { label: 'label2', value: 2 },
];

type FormValues = {
  setupValue: InputValueType;
  selectValue: InputValueType;
};

export default function Home(): ReactElement {
  const [targetValue, setTargetValue] = useState<InputValueType>(0);
  const [targetSelectValue, setTargetSelectValue] = useState<InputValueType>(
    options[0].value,
  );
  const { control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      setupValue: 0,
      selectValue: 1,
    },
  });

  const submit = (values: FormValues) => {
    console.log(`submit value =`, values);
    setTargetValue(values.setupValue);
    setTargetSelectValue(values.selectValue);
  };

  return (
    <div>
      <Tabs type="card">
        <TabPane tab="TEST" key="1">
          <form onSubmit={handleSubmit(submit)} style={{ height: '500px' }}>
            <NumberInput
              name="setupValue"
              minValue={1}
              maxValue={100}
              defaultValue={targetValue}
              label="test"
              width="130px"
              control={control}
            />

            <Select
              name="selectValue"
              label="test"
              width="130px"
              defaultValue={targetSelectValue}
              options={options}
              control={control}
            />

            <input type="submit" value="Apply" />
          </form>
        </TabPane>
      </Tabs>
    </div>
  );
}
