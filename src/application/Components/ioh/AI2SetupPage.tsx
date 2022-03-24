import React, { FC, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button, Card, Input, Select, Space } from 'antd';
import '../contents/index.css';
import styled from 'styled-components';
import IOHLogicAISetup, { LogicAIProps } from '@src/Data/IOHLogicAISetup';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';
import { WRITE_REQ } from '@src/ipcChannels';
import IpcService from '@src/main/IPCService';

import { useOncePolling } from '@src/application/hooks/ipcHook';
import SelectEx from '../Shared/SelectEx';
import NumberInput from '../Shared/NumberInput';
import InputEx from '../Shared/InputEx';

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
const SetupInputField = styled(Input)`
  width: 120px;
  font-family: Roboto, serif;
`;

interface Props {
  moduleId: number;
}

type FormValues = {
  aiInputTypeSetup: {
    aiType: number;
  }[];
  aiUnitTypeSetup: {
    unit: number;
  }[];
  aiMappingSetup: {
    mapping: number;
  }[];
  minValueSetup: {
    minValue: number;
  }[];
  maxValueSetup: {
    maxValue: number;
  }[];
};

const defaultAIMappingFields: LogicAIProps[] = [
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

const AI2SetupPage: FC<Props> = ({ moduleId }) => {
  const [defaultAISetup, setDefaultAISetup] = useState(defaultAIMappingFields);
  const { control, handleSubmit, setValue, register } = useForm<FormValues>({
    defaultValues: {
      aiInputTypeSetup: defaultAISetup,
      aiUnitTypeSetup: defaultAISetup,
      aiMappingSetup: defaultAISetup,
      minValueSetup: defaultAISetup,
      maxValueSetup: defaultAISetup,
    },
  });

  const { fields: inputTypeFields } = useFieldArray({
    control,
    name: 'aiInputTypeSetup',
  });
  const { fields: unitTypeFields } = useFieldArray({
    control,
    name: 'aiUnitTypeSetup',
  });
  const { fields: aiMappingFields } = useFieldArray({
    control,
    name: 'aiMappingSetup',
  });

  const { fields: minFields } = useFieldArray({
    control,
    name: 'minValueSetup',
  });
  const { fields: maxFields } = useFieldArray({
    control,
    name: 'maxValueSetup',
  });
  const inputTypeoptions = [
    { label: '4-20mA', value: 0 },
    { label: '0-20mA', value: 1 },
  ];
  const unitTypeoptions = [
    { label: 'None', value: 0 },
    { label: 'mA', value: 1 },
    { label: '%', value: 2 },
    { label: 'V', value: 3 },
    { label: 'A', value: 4 },
    { label: '℃', value: 5 },
    { label: '℉', value: 6 },
    { label: 'ℓ', value: 7 },
    { label: '㎥', value: 8 },
    { label: 'bar', value: 9 },
  ];
  const mappingOptions = [
    { label: 'None', value: 0 },
    { label: 'Logical Input 1', value: 1 },
    { label: 'Logical Input 2', value: 2 },
    { label: 'Logical Input 3', value: 3 },
    { label: 'Logical Input 4', value: 4 },
    { label: 'Logical Input 5', value: 5 },
    { label: 'Logical Input 6', value: 6 },
    { label: 'Logical Input 7', value: 7 },
    { label: 'Logical Input 8', value: 8 },
    { label: 'Logical Input 9', value: 9 },
    { label: 'Logical Input 10', value: 10 },
    { label: 'Logical Input 11', value: 11 },
    { label: 'Logical Input 12', value: 12 },
  ];

  const onRefresh = (): void => {
    useOncePolling(
      {
        requestType: 'IOHAI2Setup',
        responseChannel: 'get-ioh-ai2-logic-setup-data',
        props: { id: moduleId },
      },
      (evt, rest) => {
        const setup = rest as IOHLogicAISetup;

        setup.aiSetups.forEach((s, index) => {
          setValue(`aiMappingSetup.${index}.mapping`, s.mapping);
          setValue(`aiInputTypeSetup.${index}.aiType`, s.aiType);
          setValue(`aiUnitTypeSetup.${index}.unit`, s.unit);
          setValue(`maxValueSetup.${index}.maxValue`, s.maxValue);
          setValue(`minValueSetup.${index}.minValue`, s.minValue);
        });

        setDefaultAISetup(setup.aiSetups);
      },
    );
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const onSubmit = (data: FormValues) => {
    const setup = new IOHLogicAISetup();
    const aiInputType = data.aiInputTypeSetup.map((v) => v.aiType);
    const aiMapping = data.aiMappingSetup.map((v) => v.mapping);
    const aiUnit = data.aiUnitTypeSetup.map((v) => v.unit);
    const aiMax = data.maxValueSetup.map((v) => v.maxValue);
    const aiMin = data.minValueSetup.map((v) => v.minValue);

    for (let i = 0; i < 12; i += 1) {
      setup.aiSetups[i].aiType = aiInputType[i];
      setup.aiSetups[i].mapping = aiMapping[i];
      setup.aiSetups[i].unit = aiUnit[i];
      setup.aiSetups[i].maxValue = aiMax[i];
      setup.aiSetups[i].minValue = aiMin[i];
    }

    const service = IpcService.getInstance();
    service
      .send<void, ChannelWriteDataProps>(WRITE_REQ, {
        writeData: { id: moduleId, setup },
        requestType: 'IOHAI2Setup',
      })
      .then(() => {});
    onRefresh();
  };

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
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card
          size="small"
          title={`ID ${moduleId} A2750IOH-AI2 `}
          extra={<ButtonBox />}
        >
          <Space wrap={false} align="start">
            <Card size="small" title="AI Input Type 설정" type="inner">
              {inputTypeFields.map((field, index) => (
                <SetupBox key={field.id}>
                  <SetupLabel>{`CH ${(index + 1)
                    .toString()
                    .padStart(2, '0')}`}</SetupLabel>
                  <Controller
                    name={`aiInputTypeSetup.${index}.aiType` as const}
                    render={({ field: { onChange, value } }) => (
                      <SelectEx
                        onChange={onChange}
                        value={value}
                        defaultValue={defaultAISetup[index].aiType}
                        options={inputTypeoptions}
                        width="130px"
                      />
                    )}
                    control={control}
                  />
                </SetupBox>
              ))}
            </Card>
            <Card size="small" title="AI Unit Type 설정" type="inner">
              {unitTypeFields.map((field, index) => (
                <SetupBox key={field.id}>
                  <SetupLabel>{`CH ${(index + 1)
                    .toString()
                    .padStart(2, '0')}`}</SetupLabel>
                  <Controller
                    name={`aiUnitTypeSetup.${index}.unit` as const}
                    render={({ field: { onChange, value } }) => (
                      <SelectEx
                        onChange={onChange}
                        value={value}
                        defaultValue={defaultAISetup[index].unit}
                        options={unitTypeoptions}
                        width="130px"
                      />
                    )}
                    control={control}
                  />
                </SetupBox>
              ))}
            </Card>
            <Card size="small" title="AI 용도 설정" type="inner">
              {aiMappingFields.map((field, index) => (
                <SetupBox key={field.id}>
                  <SetupLabel>{`CH ${(index + 1)
                    .toString()
                    .padStart(2, '0')}`}</SetupLabel>
                  <SetupValue>
                    <Controller
                      name={`aiMappingSetup.${index}.mapping` as const}
                      render={({ field: { onChange, value } }) => (
                        <SelectEx
                          onChange={onChange}
                          value={value}
                          options={mappingOptions}
                          defaultValue={defaultAISetup[index].mapping}
                          width="130px"
                        />
                      )}
                      control={control}
                    />
                  </SetupValue>
                </SetupBox>
              ))}
            </Card>
            <Card size="small" title="AI Min 값 설정" type="inner">
              {minFields.map((field, index) => (
                <SetupBox key={field.id}>
                  <SetupLabel>{`CH ${(index + 1)
                    .toString()
                    .padStart(2, '0')}`}</SetupLabel>
                  <SetupValue>
                    <Controller
                      name={`minValueSetup.${index}.minValue` as const}
                      render={({
                        field: { onChange, value },
                        fieldState: { invalid, error },
                      }) => (
                        <InputEx
                          onChange={onChange}
                          value={value}
                          defaultValue={defaultAISetup[index].minValue}
                          width="130px"
                          error={error}
                          invalid={invalid}
                          min={-1000000}
                          max={1000000}
                        />
                      )}
                      control={control}
                    />
                  </SetupValue>
                </SetupBox>
              ))}
            </Card>
            <Card size="small" title="AI Max 값 설정" type="inner">
              {maxFields.map((field, index) => (
                <SetupBox key={field.id}>
                  <SetupLabel>{`CH ${(index + 1)
                    .toString()
                    .padStart(2, '0')}`}</SetupLabel>
                  <SetupValue>
                    <Controller
                      name={`maxValueSetup.${index}.maxValue` as const}
                      render={({ field: { onChange, value } }) => (
                        <InputEx
                          onChange={onChange}
                          defaultValue={defaultAISetup[index].maxValue}
                          value={value}
                          width="130px"
                          min={-1000000}
                          max={1000000}
                        />
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

export default AI2SetupPage;
