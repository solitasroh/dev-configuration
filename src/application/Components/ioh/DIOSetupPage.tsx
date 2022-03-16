import React, { FC, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button, Card, Select, Space } from 'antd';
import LMHLogicSetup, { LogicIOProps } from '@src/Data/LMHLogicSetup';
import '../contents/index.css';
import styled from 'styled-components';
import { useOncePolling } from '@src/application/hooks/ipcHook';
import IpcService from '@src/main/IPCService';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';
import { WRITE_REQ } from '@src/ipcChannels';
import SelectEx from '../Shared/SelectEx';

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

interface Props {
  moduleId: number;
}

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
];

const defaultDOFields: LogicIOProps[] = [
  { mapping: 1 },
  { mapping: 2 },
  { mapping: 3 },
  { mapping: 4 },
  { mapping: 5 },
  { mapping: 6 },
];

const DIOSetupPage: FC<Props> = ({ moduleId }) => {
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
  ];
  const doMappingOptions = [
    { label: 'No Use', value: 0 },
    { label: 'LOGIC DO01', value: 1 },
    { label: 'LOGIC DO02', value: 2 },
    { label: 'LOGIC DO03', value: 3 },
    { label: 'LOGIC DO04', value: 4 },
    { label: 'LOGIC DO05', value: 5 },
    { label: 'LOGIC DO06', value: 6 },
  ];
  const options = [
    { label: 'Normal', value: 0 },
    { label: 'Reverse', value: 1 },
  ];

  const onRefresh = (): void => {
    useOncePolling(
      {
        requestType: 'IOHDIOSetup',
        responseChannel: 'get-ioh-logic-setup-data',
        props: { id: moduleId },
      },
      (evt, rest) => {
        const setup = rest as LMHLogicSetup;

        setup.diSetups.forEach((s, index) => {
          setValue(`diMappingSetup.${index}.mapping`, s.mapping);
          setValue(`diPolaritySetup.${index}.polarity`, s.polarity);
        });
        console.log(setup.doSetups);
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
    const setup = new LMHLogicSetup(11);
    const diPolarity = data.diPolaritySetup.map((v) => v.polarity);
    const diMapping = data.diMappingSetup.map((v) => v.mapping);
    const doMapping = data.doSetup.map((v) => v.mapping);

    for (let i = 0; i < 11; i += 1) {
      setup.diSetups[i].polarity = diPolarity[i];
      setup.diSetups[i].mapping = diMapping[i];
    }

    for (let i = 0; i < 6; i += 1) {
      setup.doSetups[i].mapping = doMapping[i];
    }
    console.log(setup);
    const service = IpcService.getInstance();
    service
      .send<void, ChannelWriteDataProps>(WRITE_REQ, {
        writeData: {id: moduleId, setup},
        requestType: 'IOHDIOSetup',
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
          title={`ID ${moduleId} A2750IOH-DIO `}
          extra={<ButtonBox />}
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
                    render={({ field: { onChange, value } }) => (
                      <SelectEx
                        onChange={onChange}
                        value={value}
                        defaultValue={defaultDISetup[index].polarity}
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
                  <SetupLabel>{`CH ${(index + 1)
                    .toString()
                    .padStart(2, '0')}`}</SetupLabel>
                  <SetupValue>
                    <Controller
                      name={`diMappingSetup.${index}.mapping` as const}
                      render={({ field: { onChange, value } }) => (
                        <SelectEx
                          onChange={onChange}
                          value={value}
                          options={diMappingOptions}
                          defaultValue={defaultDISetup[index].mapping}
                          width="130px"
                        />
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
                      render={({ field: { onChange, value } }) => (
                        <SelectEx
                          onChange={onChange}
                          value={value}
                          options={doMappingOptions}
                          defaultValue={defaultDOSetup[index].mapping}
                          width="130px"
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

export default DIOSetupPage;
