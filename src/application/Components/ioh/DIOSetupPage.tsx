import React, { FC } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Card, Col, InputNumber, Row, Select, Space, Typography } from 'antd';
import { LogicIOProps } from '@src/Data/LMHLogicSetup';
import '../contents/index.css';
import styled from 'styled-components';

const SetupGroup = styled.div`
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  margin-bottom: 10px;
  padding: 10px;
`;

const SetupBox = styled.div`
  display: flex;
  flex-flow: column;
  background-color: #7ca1c5;
  margin-bottom: 10px;
  border: 1px solid #ffffff;
  padding: 10px;
`;

const SetupLabel = styled.div`
  display: flex;
  margin-bottom: 10px;
  font-size: 9pt;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-weight: 500;
  color: white;
`;
const SetupValue = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const { Text } = Typography;

interface Props {
  moduleId: number;
  diCount: number;
}

type FormValues = {
  diSetup: {
    polarity: number;
    mapping: number;
  }[];
  doSetup: {
    mapping: number;
  }[];
};

const defaultDIFields: LogicIOProps[] = [
  { polarity: 0, mapping: 1 },
  { polarity: 0, mapping: 2 },
  { polarity: 0, mapping: 3 },
  { polarity: 0, mapping: 4 },
  { polarity: 0, mapping: 5 },
  { polarity: 0, mapping: 6 },
  { polarity: 0, mapping: 7 },
  { polarity: 0, mapping: 8 },
  { polarity: 0, mapping: 9 },
  { polarity: 0, mapping: 10 },
  { polarity: 0, mapping: 11 },
];

const defaultDOFields: LogicIOProps[] = [
  { mapping: 1 },
  { mapping: 2 },
  { mapping: 3 },
  { mapping: 4 },
  { mapping: 5 },
  { mapping: 6 },
];

const inputStyle = {
  width: '70%',
  backgroundColor: '#f5f5f5',
  display: 'flex',
};

const DIOSetupPage: FC<Props> = ({ diCount, moduleId }) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      diSetup: defaultDIFields,
      doSetup: defaultDOFields,
    },
  });

  const { fields: diFields } = useFieldArray({
    control,
    name: 'diSetup',
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
        <Space wrap direction="vertical">
          <Card size="small" style={{ minWidth: '500px' }} title="SETUP DI">
            <Row
              gutter={[16, 24]}
              style={{ marginBottom: '3px', backgroundColor: '#a5a5a5' }}
              justify="center"
              align="middle"
            >
              <Col span={6} style={{}}>
                <Text style={{ fontWeight: 600, fontSize: '10pt' }} ellipsis>
                  Channel
                </Text>
              </Col>
              <Col span={8}>
                <Text style={{ fontWeight: 600, fontSize: '10pt' }} ellipsis>
                  Polarity
                </Text>
              </Col>
              <Col span={8}>
                <Text style={{ fontWeight: 600, fontSize: '10pt' }} ellipsis>
                  Mapping
                </Text>
              </Col>
            </Row>
            {diFields.map((field, index) => (
              <Row
                gutter={16}
                key={field.id}
                wrap={false}
                justify="start"
                style={{ marginBottom: 1, backgroundColor: '#e7e7e7' }}
              >
                <Col span={6}>
                  <Text
                    style={{ fontSize: '10pt', fontWeight: 600, padding: 2 }}
                    ellipsis
                  >{`channel ${index + 1}`}</Text>
                </Col>
                <Col span={8}>
                  <Controller
                    name={`diSetup.${index}.polarity` as const}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Select
                        onChange={onChange}
                        value={value}
                        options={options}
                        size="small"
                        style={{ width: '90%' }}
                      />
                    )}
                    control={control}
                  />
                </Col>
                <Col span={8}>
                  <Controller
                    name={`diSetup.${index}.mapping` as const}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputNumber
                        onChange={onChange}
                        value={value}
                        size="small"
                        style={{ width: '90%' }}
                      />
                    )}
                    control={control}
                  />
                </Col>
              </Row>
            ))}
          </Card>

          <Card size="small" title="SETUP DO">
            <SetupGroup>
              {doFields.map((field, index) => (
                <SetupBox key={field.id}>
                  <SetupLabel>{`Channel ${index + 1} Mapping`}</SetupLabel>
                  <SetupValue>
                    <Controller
                      name={`doSetup.${index}.mapping` as const}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <InputNumber
                          onChange={onChange}
                          value={value}
                          size="small"
                          style={inputStyle}
                        />
                      )}
                      control={control}
                    />
                  </SetupValue>
                </SetupBox>
              ))}
            </SetupGroup>
          </Card>
        </Space>
      </form>
    </div>
  );
};

export default DIOSetupPage;
