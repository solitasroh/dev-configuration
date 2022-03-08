import { LogicTypeProps } from '@src/Data/LogicModuleSetup';
import { Button, Card, Select, Space } from 'antd';
import React, { FC } from 'react';
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
    type: number;
  }[];
};
const defaultModuleTypeFields: LogicTypeProps[] = [
  { type: 0 },
  { type: 0 },
  { type: 0 },
  { type: 0 },
  { type: 0 },
  { type: 0 },
  { type: 0 },
  { type: 0 },
  { type: 0 },
  { type: 0 },
  { type: 0 },
  { type: 0 },
  { type: 0 },
  { type: 0 },
  { type: 0 },
];
const ModuleTypeSetup: FC = () => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      logicalModuleTypeSetup: defaultModuleTypeFields,
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
  return (
    <div>
      <form>
          <Space wrap={false} align="start">
            <Card size="small" title="Logical Module Type 설정" type="inner" extra={<Button htmlType="submit">Accept</Button>}>
              {typeFields.map((field, index) => (
                <SetupBox key={field.id}>
                  <SetupLabel>{`IO ID ${(index + 1)
                    .toString()
                    .padStart(2, '0')}`}</SetupLabel>
                  <Controller
                    name={`logicalModuleTypeSetup.${index}.type` as const}
                    render={({ field: { onChange, value } }) => (
                      <SetupField
                        onChange={onChange}
                        value={value}
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