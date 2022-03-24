import { Card, List, Space, Tabs } from 'antd';
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
import IncomingUnitBox from './IncomingUnitBox';
import LocalUnitBox from '../lmh/LocalUnitBox';
import { usePolling } from '@src/application/hooks/ipcHook';
import { IncomingStatus } from '@src/main/modbus.a2700m/m/RegisterIncomingStatus';

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
  { key: 1, id: 1 },
  { key: 2, id: 2 },
  { key: 3, id: 3 },
  { key: 4, id: 4 },
  { key: 5, id: 5 },
  { key: 6, id: 6 },
  { key: 7, id: 7 },
  { key: 8, id: 8 },
  { key: 9, id: 9 },
  { key: 10, id: 10 },
  { key: 11, id: 11 },
  { key: 12, id: 12 },
  { key: 13, id: 13 },
  { key: 14, id: 14 },
  { key: 15, id: 15 },
  { key: 16, id: 16 },
  { key: 17, id: 17 },
  { key: 18, id: 18 },
  { key: 19, id: 19 },
  { key: 20, id: 20 },
  { key: 21, id: 21 },
  { key: 22, id: 22 },
  { key: 23, id: 23 },
  { key: 24, id: 24 },
  { key: 25, id: 25 },
  { key: 26, id: 26 },
  { key: 27, id: 27 },
  { key: 28, id: 28 },
  { key: 29, id: 29 },
  { key: 30, id: 30 },
  { key: 31, id: 31 },
  { key: 32, id: 32 },
  { key: 33, id: 33 },
  { key: 34, id: 34 },
  { key: 35, id: 35 },
  { key: 36, id: 36 },
  { key: 37, id: 37 },
  { key: 38, id: 38 },
  { key: 39, id: 39 },
  { key: 40, id: 40 },
];

export default function Home(): ReactElement {
  const [targetValue, setTargetValue] = useState<InputValueType>(0);
  const [incommingInfo , setIncommingInfo] = useState<IncomingStatus>();
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
  
  usePolling(
    {
      responseChannel: 'POLL-LMH-information',
      requestType: 'IncomingStatus',
      props: { id: 0 },
    },
    (evt, rest) => {
      const infoList = rest as IncomingStatus;
      setIncommingInfo(infoList);
    },
    1000,
  );
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
    <div>
      <Space>
        <IncomingUnitBox incommingInfo = {incommingInfo}/>
      </Space>
      <Card title="MOTOR UNIT" size="small" bordered={false}>
        <List
          dataSource={motorUnits}
          split
          pagination={{
            pageSize: 5,
          }}
          itemLayout="horizontal"
          renderItem={(item) => (
            <Space>
              <MotorUnitBox id={item.id} />
            </Space>
          )}
        />
      </Card>
      <Card title="LOCAL UNIT" size="small" bordered={false} >
        <LocalUnitBox unitInfo = {motorUnits.slice(0, 15)} mismatch = {incommingInfo?.mismatchState}/>
      </Card>
    </div>
  );
}
