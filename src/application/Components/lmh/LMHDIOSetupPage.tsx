import React, { FC, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button, Card, Space } from 'antd';
import LMHLogicSetup, { LogicIOProps } from '@src/Data/LMHLogicSetup';
import '../contents/index.css';
import styled from 'styled-components';
import IpcService from '@src/main/IPCService';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';
import { WRITE_REQ } from '@src/ipcChannels';
import { useOncePolling } from '@src/application/hooks/ipcHook';
import SelectEx from '../Shared/SelectEx';

const SetupBox = styled.div`
  display: flex;
  margin-bottom: 3px;
  border: 1px solid #ffffff;
  padding: 1px;
  justify-content: flex-start;
  align-items: center;
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
const defaultDOFields: LogicIOProps[] = [
  { mapping: 0 },
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

interface Prop {}

const LMHDIOSetupPage: FC<Prop> = ({}: Prop) => {
  const [defaultDISetup, setDefaultDISetup] = useState(defaultDIPolarityFields);
  const [defaultDOSetup, setDefaultDOSetup] = useState(defaultDOFields);
  const { control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      diPolaritySetup: defaultDISetup,
      diMappingSetup: defaultDISetup,
      doSetup: defaultDOSetup,
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
    { label: 'Normal', value: 0 },
    { label: 'Reverse', value: 1 },
  ];

  const diMappingOptions = [
    { label: 'No Use', value: 0 },
    { label: 'LOGIC DI01', value: 1 },
    { label: 'LOGIC DI02', value: 2 },
    { label: 'LOGIC DI03', value: 3 },
    { label: 'LOGIC DI04', value: 4 },
    { label: 'LOGIC DI05', value: 5 },
    { label: 'LOGIC DI06', value: 6 },
    { label: 'LOGIC DI07', value: 7 },
    { label: 'LOGIC DI08', value: 8 },
    { label: 'LOGIC DI09', value: 9 },
    { label: 'LOGIC DI10', value: 10 },
    { label: 'LOGIC DI11', value: 11 },
    { label: 'LOGIC DI12', value: 12 },
    { label: 'LOGIC DI13', value: 13 },
    { label: 'LOGIC DI14', value: 14 },
    { label: 'LOGIC DI15', value: 15 },
    { label: 'LOGIC DI16', value: 16 },
    { label: 'LOGIC DI17', value: 17 },
    { label: 'LOGIC DI18', value: 18 },
  ];

  const doMappingOptions = [
    { label: 'No Use', value: 0 },
    { label: 'LOGIC DO01', value: 1 },
    { label: 'LOGIC DO02', value: 2 },
    { label: 'LOGIC DO03', value: 3 },
    { label: 'LOGIC DO04', value: 4 },
    { label: 'LOGIC DO05', value: 5 },
    { label: 'LOGIC DO06', value: 6 },
    { label: 'LOGIC DO07', value: 7 },
    { label: 'LOGIC DO08', value: 8 },
    { label: 'LOGIC DO09', value: 9 },
  ];

  const onRefresh = (): void => {
    useOncePolling(
      {
        requestType: 'LMLogicIOSetup',
        responseChannel: 'get-lm-logic-setup-data',
      },
      (evt, rest) => {
        const setup = rest as LMHLogicSetup;

        setup.diSetups.forEach((s, index) => {
          setValue(`diMappingSetup.${index}.mapping`, s.mapping);
          setValue(`diPolaritySetup.${index}.polarity`, s.polarity);
        });

        setup.doSetups.forEach((s, index) => {
          setValue(`doSetup.${index}.mapping`, s.mapping);
        });

        setDefaultDISetup(setup.diSetups);
        setDefaultDOSetup(setup.doSetups);
      },
    );
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const onSubmit = (data: FormValues) => {
    const setup = new LMHLogicSetup(18);
    const diPolarity = data.diPolaritySetup.map((v) => v.polarity);
    const diMapping = data.diMappingSetup.map((v) => v.mapping);
    const doMapping = data.doSetup.map((v) => v.mapping);

    for (let i = 0; i < 18; i += 1) {
      setup.diSetups[i].polarity = diPolarity[i];
      setup.diSetups[i].mapping = diMapping[i];
    }
    for (let i = 0; i < 9; i += 1) {
      setup.doSetups[i].mapping = doMapping[i];
    }

    const service = IpcService.getInstance();
    service
      .send<void, ChannelWriteDataProps>(WRITE_REQ, {
        writeData: setup,
        requestType: 'LMLogicIOSetup',
      })
      .then(() => {});

    onRefresh();
  };
  const ButtonBox = () => (
    <div style={{ display: 'flex' }}>
      <Button htmlType="submit">Accept</Button>
      <Button onClick={() => onRefresh()}>Refresh</Button>
    </div>
  );
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card size="small" title={`A2750LMH `} extra={<ButtonBox />}>
          <Space wrap={false} align="start">
            <Card size="small" title="DI 극성 설정" type="inner">
              {diFields.map((field, index) => (
                <SetupBox key={field.id}>
                  <Controller
                    name={`diPolaritySetup.${index}.polarity` as const}
                    render={({ field: { onChange, value } }) => (
                      <SelectEx
                        label={`CH ${(index + 1).toString().padStart(2, '0')}`}
                        onChange={onChange}
                        defaultValue={defaultDISetup[index].polarity}
                        value={value}
                        options={options}
                        width="130px"
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
                  <Controller
                    name={`diMappingSetup.${index}.mapping` as const}
                    render={({ field: { onChange, value } }) => (
                      <SelectEx
                        label={`CH ${(index + 1).toString().padStart(2, '0')}`}
                        onChange={onChange}
                        value={value}
                        defaultValue={defaultDISetup[index].mapping}
                        options={diMappingOptions}
                        width="130px"
                      />
                    )}
                    control={control}
                  />
                </SetupBox>
              ))}
            </Card>

            <Card size="small" title="DO 용도 설정" type="inner">
              {doFields.map((field, index) => (
                <SetupBox key={field.id}>
                  <Controller
                    name={`doSetup.${index}.mapping` as const}
                    render={({ field: { onChange, value } }) => (
                      <SelectEx
                        label={`CH ${(index + 1).toString().padStart(2, '0')}`}
                        onChange={onChange}
                        value={value}
                        defaultValue={defaultDOSetup[index].mapping}
                        options={doMappingOptions}
                        width="130px"
                      />
                    )}
                    control={control}
                  />
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
