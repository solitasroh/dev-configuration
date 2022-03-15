import React, { FC, useEffect, useState } from 'react';
import { useOncePolling } from '@src/application/hooks/ipcHook';
import IOHLogicalTypeSetup, { LogicModuleType } from '@src/Data/IOHLogicalTypeSetup';
import { LogicTypeProps } from '@src/Data/LogicModuleSetup';
import { WRITE_REQ } from '@src/ipcChannels';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';
import IpcService from '@src/main/IPCService';
import { Button, Card, Select, Space } from 'antd';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import styled from 'styled-components';

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

const SetupField = styled(Select)`
  width: 120px;
  font-family: Roboto, serif;
`;

type FormValues = {
  logicalModuleTypeSetup: {
    moduleType: number;
  }[];
};
const defaultModuleTypeFields: LogicModuleType[] = [
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
  { moduleType: 0 },
];
const ModuleTypeSetup: FC = () => {  
  const [typeSetup, setTypeSetup] = useState(defaultModuleTypeFields);
  const { control, handleSubmit,setValue } = useForm<FormValues>({
    defaultValues: {
      logicalModuleTypeSetup: typeSetup,
    },
  });
  const { fields: typeFields } = useFieldArray({
    control,
    name: 'logicalModuleTypeSetup',
  });

  const options = [
    { label: 'None', value: 0 },
    { label: 'DI', value: 1 },
    { label: 'DO', value: 2 },
    { label: 'AI', value: 3 },
    { label: 'DI2', value: 4 },
    { label: 'DIO', value: 5 },
    { label: 'DO2', value: 6 },
    { label: 'AIO', value: 7 },
    { label: 'AI2', value: 8 },
  ];
  const onRefresh = (): void => {
    useOncePolling(
      {
        requestType: 'IOHLogicalTypeSetup',
        responseChannel: 'get-lm-logic-type-data',
      },
      (evt, rest) => {
        console.log("on Refresh");
        const setup = rest as IOHLogicalTypeSetup;
        
        setup.moduleTypes.forEach((s, index) => {
          setValue(`logicalModuleTypeSetup.${index}.moduleType`, s.moduleType);
        });
        setTypeSetup(setup.moduleTypes);
      },
    );
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const onSubmit = (data: FormValues) => {
    const setup = new IOHLogicalTypeSetup();
    const moduleType = data.logicalModuleTypeSetup.map((v) => v.moduleType);

    for (let i = 0; i < 15; i += 1) {
      setup.moduleTypes[i].moduleType = moduleType[i];
    }
    const service = IpcService.getInstance();
    service
      .send<void, ChannelWriteDataProps>(WRITE_REQ, {
        writeData: setup,
        requestType: 'IOHLogicalTypeSetup',
      })
      .then(() => {});
    onRefresh();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Space wrap={false} align="start">
          <Card
            size="small"
            title="Logical Module Type 설정"
            type="inner"
            extra={<Button htmlType="submit">Accept</Button>}
          >
            {typeFields.map((field, index) => (
              <SetupBox key={field.id}>
                <SetupLabel>{`IO ID ${(index + 1)
                  .toString()
                  .padStart(2, '0')}`}</SetupLabel>
                <Controller
                  name={`logicalModuleTypeSetup.${index}.moduleType` as const}
                  render={({ field: { onChange, value } }) => (
                    <SetupField
                      onChange={onChange}
                      value={value}
                      defaultValue={typeSetup[index].moduleType}
                      options={options}
                    />
                  )}
                  control={control}
                />
              </SetupBox>
            ))}
          </Card>
        </Space>
      </form>
    </div>
  );
};

export default ModuleTypeSetup;
