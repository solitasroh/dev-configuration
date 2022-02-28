import React, { FC } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button, Card, Divider, Select, Space, Typography } from 'antd';
import { LogicIOProps } from '@src/Data/LMHLogicSetup';
import '../contents/index.css';
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
  display: flex;
  margin-right: 6px;
  font-size: 8pt;
  font-family: Roboto, serif;
  font-weight: 500;
  color: ${labelColor};
`;

const SetupValue = styled.div`
  display: flex;
  justify-content: flex-end;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-size: 10pt;
  font-weight: 400;
`;

const SetupField = styled(Select)`
  width: 120px;
  font-family: Roboto, serif;
`;

type FormValues = {
  diPolaritySetup: {
    polarity: number;
  }[];
  diMappingSetup: {
    mapping: number;
  }[];
  doSetup: {
    mapping: number;
  }[];
};

const defaultDIPolarityFields: LogicIOProps[] = [
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
  { polarity: 0 },
];

const defaultDIMappingFields: LogicIOProps[] = [
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
  { mapping: 0 },
];

const defaultDOFields: LogicIOProps[] = [
  { mapping: 1 },
  { mapping: 2 },
  { mapping: 3 },
  { mapping: 4 },
  { mapping: 5 },
  { mapping: 6 },
  { mapping: 7 },
  { mapping: 8 },
  { mapping: 9 },
];

const inputStyle = {
  width: '70%',
  backgroundColor: '#f5f5f5',
  display: 'flex',
};

const LMHDIOSetupPage: FC = () => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      diPolaritySetup: defaultDIPolarityFields,
      diMappingSetup: defaultDIMappingFields,
      doSetup: defaultDOFields,
    },
  });

  const { fields: diFields } = useFieldArray({
    control,
    name: 'diPolaritySetup',
  });

  const { fields: diMappingFields } = useFieldArray({
    control,
    name: 'diMappingSetup',
  });

  const { fields: doFields } = useFieldArray({
    control,
    name: 'doSetup',
  });

  const options = [
    { label: 'None', value: 0 },
    { label: 'Normal', value: 1 },
    { label: 'Reverse', value: 2 },
  ];

  return (
    <div>
      <form>
        <Card
          size="small"
          title={`A2750LMH `}
          extra={<Button htmlType="submit">Accept</Button>}
        >
          <Space wrap={false} align="start">
            <Card size="small" title="DI 극성 설정" type="inner">
              {diFields.map((field, index) => (
                <SetupBox key={field.id}>
                  <SetupLabel>{`CH ${(index + 1)
                    .toString()
                    .padStart(2, '0')}`}</SetupLabel>
                  <Controller
                    name={`diPolaritySetup.${index}.polarity` as const}
                    render={({ field: { onChange, onBlur, value } }) => (
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

            <Card size="small" title="DI 용도 설정" type="inner">
              {diMappingFields.map((field, index) => (
                <SetupBox key={field.id}>
                  <SetupLabel>{`CH ${(index + 1)
                    .toString()
                    .padStart(2, '0')}`}</SetupLabel>
                  <SetupValue>
                    <Controller
                      name={`diMappingSetup.${index}.mapping` as const}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <SetupField onChange={onChange} value={value} />
                      )}
                      control={control}
                    />
                  </SetupValue>
                </SetupBox>
              ))}
            </Card>

            <Card size="small" title="DO 용도 설정" type="inner">
              {doFields.map((field, index) => (
                <SetupBox key={field.id}>
                  <SetupLabel>{`CH ${(index + 1)
                    .toString()
                    .padStart(2, '0')}`}</SetupLabel>
                  <SetupValue>
                    <Controller
                      name={`doSetup.${index}.mapping` as const}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <SetupField onChange={onChange} value={value} />
                      )}
                      control={control}
                    />
                  </SetupValue>
                </SetupBox>
              ))}
            </Card>
          </Space>
        </Card>
      </form>
    </div>
  );
};

export default LMHDIOSetupPage;
