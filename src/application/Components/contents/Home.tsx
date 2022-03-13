import { Tabs } from 'antd';
import React, { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select, {
  SelectOptionType,
} from '@src/application/Components/Shared/Select';
import { InputValueType } from '@src/application/Components/Shared/Shared';
import MotorUnitBox, {
  ControlModeDefinition,
  MotorStatusDefinition,
} from '@src/application/Components/pc/MotorUnitBox';
import NumberInput from '../Shared/NumberInput';

const { TabPane } = Tabs;

const options: SelectOptionType[] = [
  { label: 'label1', value: 1 },
  { label: 'label2', value: 2 },
];

type FormValues = {
  setupValue: InputValueType;
  selectValue: InputValueType;
};
const motorUnits = [
  {
    key: 1,
    id: 1,
    name: 'motor unit 01',
    motorStatus: MotorStatusDefinition.Run,
    controlMode: ControlModeDefinition.Local,
  },
  {
    key: 2,
    id: 2,
    name: 'motor unit 02',
    motorStatus: MotorStatusDefinition.Stop,
    controlMode: ControlModeDefinition.Remote,
  },
  {
    key: 3,
    id: 3,
    name: 'motor unit 03',
    motorStatus: MotorStatusDefinition.Run,
    controlMode: ControlModeDefinition.Local,
  },
  {
    key: 4,
    id: 4,
    name: 'motor unit 04',
    motorStatus: MotorStatusDefinition.Stop,
    controlMode: ControlModeDefinition.Remote,
  },
  {
    key: 5,
    id: 5,
    name: 'motor unit 05',
    motorStatus: MotorStatusDefinition.Run,
    controlMode: ControlModeDefinition.Local,
  },
  {
    key: 6,
    id: 5,
    name: 'motor unit 05',
    motorStatus: MotorStatusDefinition.Run,
    controlMode: ControlModeDefinition.Local,
  },
  {
    key: 7,
    id: 5,
    name: 'motor unit 05',
    motorStatus: MotorStatusDefinition.Run,
    controlMode: ControlModeDefinition.Local,
  },
  {
    key: 8,
    id: 5,
    name: 'motor unit 05',
    motorStatus: MotorStatusDefinition.Run,
    controlMode: ControlModeDefinition.Local,
  },
  {
    key: 9,
    id: 5,
    name: 'motor unit 05',
    motorStatus: MotorStatusDefinition.Run,
    controlMode: ControlModeDefinition.Local,
  },
  {
    key: 10,
    id: 5,
    name: 'motor unit 05',
    motorStatus: MotorStatusDefinition.Run,
    controlMode: ControlModeDefinition.Local,
  },
  {
    key: 11,
    id: 5,
    name: 'motor unit 05',
    motorStatus: MotorStatusDefinition.Run,
    controlMode: ControlModeDefinition.Local,
  },
  {
    key: 12,
    id: 5,
    name: 'motor unit 05',
    motorStatus: MotorStatusDefinition.Run,
    controlMode: ControlModeDefinition.Local,
  },
  {
    key: 13,
    id: 5,
    name: 'motor unit 05',
    motorStatus: MotorStatusDefinition.Run,
    controlMode: ControlModeDefinition.Local,
  },
];

export default function Home(): ReactElement {
  const [targetValue, setTargetValue] = useState<InputValueType>(0);
  const [targetSelectValue, setTargetSelectValue] = useState<InputValueType>(
    options[0].value,
  );
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      setupValue: 0,
      selectValue: 1,
    },
    mode: 'onChange',
  });

  const submit = (values: FormValues) => {
    console.log(`submit value =`, values);
    setTargetValue(values.setupValue);
    setTargetSelectValue(values.selectValue);
  };

  function getTabs() {
    return (
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
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#f2f2f2',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        height: '100vh',
      }}
    >
      {motorUnits.map((ni) => (
        <MotorUnitBox
          id={ni.id}
          name={ni.name}
          controlMode={ni.controlMode}
          motorStatus={ni.motorStatus}
        />
      ))}
    </div>
  );
}
