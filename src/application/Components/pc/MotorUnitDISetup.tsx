import React, { useEffect, useState } from 'react';
import { Button, Card, Space } from 'antd';
import { useOncePolling } from '@src/application/hooks/ipcHook';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import styled from 'styled-components';
import SelectEx from '@src/application/Components/Shared/SelectEx';
import { A2750DOSetupData } from '@src/main/modbus.a2700m/pc/RegisterDISetup';
import IpcService from '@src/main/IPCService';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';
import { WRITE_REQ } from '@src/ipcChannels';
import { sleep } from '@src/Utils';

const labelColor = '#7e7e7e';

const SetupBox = styled.div`
  display: flex;
  margin-bottom: 3px;
  border: 1px solid #ffffff;
  padding: 1px;
  justify-content: flex-start;
  align-items: center;
`;

const SetupLabel = styled.div`
  display: inline-block;
  white-space: nowrap;
  margin-right: 6px;
  font-size: 8pt;
  font-family: Roboto, serif;
  font-weight: 500;
  color: ${labelColor};
  text-wrap: none;
`;

const defaultDIFields = [
  { diUse: 0 },
  { diUse: 0 },
  { diUse: 0 },
  { diUse: 0 },
  { diUse: 0 },
  { diUse: 0 },
  { diUse: 0 },
  { diUse: 0 },
  { diUse: 0 },
];

type FormValues = {
  diSetup: {
    diUse: number;
  }[];
};
interface Props {
  moduleId: number;
}
const MotorUnitDISetup: React.FC<Props> = ({ moduleId }: Props) => {
  const [defaultDISetup, setDefaultDISetup] = useState(defaultDIFields);

  const { control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: { diSetup: defaultDISetup },
  });

  const { fields: diSetupFields } = useFieldArray({
    control,
    name: 'diSetup',
  });

  const diMappingOptions = [
    { label: 'No Use', value: 0 },
    { label: 'RUN1', value: 1 },
    { label: 'RUN2', value: 2 },

    { label: 'STOP', value: 3 },
    { label: 'Remote Select', value: 4 },
    { label: 'Off Mode', value: 5 },
    { label: 'RUN1 Status', value: 6 },
    { label: 'RUN2 Status', value: 7 },
    { label: 'Emergency Start', value: 8 },
    { label: 'Event Reset', value: 9 },
    { label: 'Reserved', value: 10 },
    { label: 'MCCB Trip', value: 11 },
    { label: 'External Alarm', value: 12 },
    { label: 'Control Power Monitoring', value: 13 },
    { label: 'Inverter MCCB Trip', value: 14 },
    { label: 'Inverter RUN1 Status', value: 15 },
    { label: 'Inverter RUN2 Status', value: 16 },
    { label: 'Inverter Fault1', value: 17 },
    { label: 'Inverter Fault2', value: 18 },

    { label: 'General DI1', value: 101 },
    { label: 'General DI2', value: 102 },
    { label: 'General DI3', value: 103 },
    { label: 'General DI4', value: 104 },
    { label: 'General DI5', value: 105 },
    { label: 'General DI6', value: 106 },
    { label: 'General DI7', value: 107 },
    { label: 'General DI8', value: 108 },
    { label: 'General DI9', value: 109 },
    { label: 'General DI10', value: 110 },
  ];
  const onRefresh = (): void => {
    useOncePolling(
      {
        requestType: 'MotorUnitDiSetup',
        responseChannel: 'get-motor-di-setup-data',
        props: { id: moduleId },
      },
      (evt, rest) => {
        const setup = rest as A2750DOSetupData;

        setup.setup.forEach((s, index) => {
          setValue(`diSetup.${index}.diUse`, s);
        });
        const diSetupMapping = setup.setup.map((data) => {
          return {
            diUse: data,
          };
        });

        setDefaultDISetup(diSetupMapping);
      },
    );
  };

  useEffect(() => onRefresh(), []);

  const ButtonBox = () => (
    <div style={{ display: 'flex' }}>
      <Space>
        <Button
          htmlType="submit"
          type="primary"
          size="middle"
          style={{ fontSize: '12px' }}
        >
          Accept
        </Button>
        <Button
          onClick={() => onRefresh()}
          size="middle"
          style={{ fontSize: '12px' }}
        >
          Refresh
        </Button>
      </Space>
    </div>
  );

  const onSubmit = async (data: FormValues) => {
    const diMapping = data.diSetup.map((v) => v.diUse);

    const service = IpcService.getInstance();
    service
      .send<void, ChannelWriteDataProps>(WRITE_REQ, {
        writeData: { id: moduleId, setup: diMapping },
        requestType: 'MotorUnitDiSetup',
      })
      .then(() => {});
    await sleep(1000);
    onRefresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card size="small" title={'DI 용도 설정'} extra={<ButtonBox />}>
        {diSetupFields.map((field, index) => (
          <SetupBox key={field.id}>
            <SetupLabel>{`CH ${(index + 1)
              .toString()
              .padStart(2, '0')}`}</SetupLabel>

            <Controller
              name={`diSetup.${index}.diUse` as const}
              render={({ field: { onChange, value } }) => (
                <SelectEx
                  onChange={onChange}
                  value={value}
                  defaultValue={defaultDISetup[index].diUse}
                  options={diMappingOptions}
                  width="230px"
                />
              )}
              control={control}
            />
          </SetupBox>
        ))}
      </Card>
    </form>
  );
};

export default MotorUnitDISetup;
