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

const defaultDOFields = [
  { doUse: 0 },
  { doUse: 0 },
  { doUse: 0 },
  { doUse: 0 },
];

type FormValues = {
  doSetup: {
    doUse: number;
  }[];
};
interface Props {
  moduleId: number;
}
const MotorUnitDOSetup: React.FC<Props> = ({ moduleId }: Props) => {
  const [defaultDOSetup, setDefaultDOSetup] = useState(defaultDOFields);

  const { control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: { doSetup: defaultDOSetup },
  });

  const { fields: doSetupFields } = useFieldArray({
    control,
    name: 'doSetup',
  });

  const doMappingOptions = [
    { label: 'No Use', value: 0 },
    { label: 'RUN1', value: 1 },
    { label: 'RUN2', value: 2 },

    { label: 'Alarm', value: 3 },
    { label: 'Fault', value: 4 },
    { label: 'Inverter RUN1', value: 5 },
    { label: 'Inverter RUN2', value: 6 },
    { label: 'MCCB TRIP/', value: 7 },

    { label: 'General DO1', value: 101 },
    { label: 'General DO2', value: 102 },
    { label: 'General DO3', value: 103 },
    { label: 'General DO4', value: 104 },
  ];
  const onRefresh = (): void => {
    useOncePolling(
      {
        requestType: 'MotorUnitDoSetup',
        responseChannel: 'get-motor-do-setup-data',
        props: { id: moduleId },
      },
      (evt, rest) => {
        const setup = rest as A2750DOSetupData;

        setup.setup.forEach((s, index) => {
          setValue(`doSetup.${index}.doUse`, s);
        });
        const doSetupMapping = setup.setup.map((data) => {
          return {
            doUse: data,
          };
        });

        setDefaultDOSetup(doSetupMapping);
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
    const doMapping = data.doSetup.map((v) => v.doUse);

    const service = IpcService.getInstance();
    service
      .send<void, ChannelWriteDataProps>(WRITE_REQ, {
        writeData: { id: moduleId, setup: doMapping },
        requestType: 'MotorUnitDoSetup',
      })
      .then(() => {});
    await sleep(1000);
    onRefresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card size="small" title={'DO 용도 설정'} extra={<ButtonBox />}>
        {doSetupFields.map((field, index) => (
          <SetupBox key={field.id}>
            <SetupLabel>{`CH ${(index + 1)
              .toString()
              .padStart(2, '0')}`}</SetupLabel>

            <Controller
              name={`doSetup.${index}.doUse` as const}
              render={({ field: { onChange, value } }) => (
                <SelectEx
                  onChange={onChange}
                  value={value}
                  defaultValue={defaultDOSetup[index].doUse}
                  options={doMappingOptions}
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

export default MotorUnitDOSetup;
