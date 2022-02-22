import React, { ReactElement, useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import LMHLogicSetup, { LogicIOProps } from '@src/Data/LMHLogicSetup';
import { useOncePolling } from '@src/application/hooks/ipcHook';
import { Button, Card, Col, InputNumber, Row, Select } from 'antd';
import IpcService from '@src/main/IPCService';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';
import { WRITE_REQ } from '@src/ipcChannels';

type FormValues = {
  ioSetup: {
    diPolarity: number;
    diMapping: number;
    doMapping: number;
  }[];
};

const defaultValues: LogicIOProps[] = [
  { diPolarity: 0, diMapping: 1, doMapping: 1 },
  { diPolarity: 0, diMapping: 2, doMapping: 2 },
  { diPolarity: 0, diMapping: 3, doMapping: 3 },
  { diPolarity: 0, diMapping: 4, doMapping: 4 },
  { diPolarity: 0, diMapping: 5, doMapping: 5 },
  { diPolarity: 0, diMapping: 6, doMapping: 6 },
  { diPolarity: 0, diMapping: 7, doMapping: 7 },
  { diPolarity: 0, diMapping: 8, doMapping: 8 },
  { diPolarity: 0, diMapping: 9, doMapping: 9 },
  { diPolarity: 0, diMapping: 10, doMapping: 0 },
  { diPolarity: 0, diMapping: 11, doMapping: 0 },
  { diPolarity: 0, diMapping: 12, doMapping: 0 },
  { diPolarity: 0, diMapping: 13, doMapping: 0 },
  { diPolarity: 0, diMapping: 14, doMapping: 0 },
  { diPolarity: 0, diMapping: 15, doMapping: 0 },
  { diPolarity: 0, diMapping: 16, doMapping: 0 },
  { diPolarity: 0, diMapping: 17, doMapping: 0 },
  { diPolarity: 0, diMapping: 18, doMapping: 0 },
  { diPolarity: 0, diMapping: 19, doMapping: 0 },
];

function LMHDIOSetup(): ReactElement {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      ioSetup: defaultValues,
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'ioSetup',
  });

  useEffect(() => {
    useOncePolling(
      {
        requestType: 'LMLogicSetup',
        responseChannel: 'POLL-LM-LOGIC-SETUP',
      },
      (evt, resp) => {
        const data = resp as LMHLogicSetup;
        replace(data.detail);
      },
    );
  }, []);

  const onSubmit = (data: FormValues) => {
    const setup = new LMHLogicSetup(18);
    setup.detail = data.ioSetup.map((v, index) => {
      const result: LogicIOProps = {
        diPolarity: v.diPolarity,
        diMapping: v.diMapping,
        doMapping: v.doMapping,
      };
      return result;
    });

    const service = IpcService.getInstance();
    service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
      writeData: setup,
      requestType: 'LMLogicSetup',
    });
  };

  const options = [
    { label: 'None', value: 0 },
    { label: 'Normal', value: 1 },
    { label: 'Reverse', value: 2 },
  ];
  const inputStyle = { minWidth: 120, backgroundColor: '#daeaff' };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: 600 }}>
      <Card
        title="Logic DI Setup"
        size="small"
        type="inner"
        extra={<Button htmlType="submit">Accept</Button>}
      >
        <div style={{ overflowY: 'auto', overflowX: 'auto' }}>
          {fields.map((field, index) => (
            <div key={field.id}>
              <Row key={field.id} style={{ marginBottom: '5px' }} wrap={false}>
                <Col style={{ fontWeight: 600, width: 110 }}>{`channel ${
                  index + 1
                }`}</Col>
                <Col style={{ marginRight: 15, width: 110 }}>polarity</Col>
                <Col>
                  <Controller
                    name={`ioSetup.${index}.diPolarity` as const}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Select
                        onChange={onChange}
                        value={value}
                        options={options}
                        size="small"
                        style={inputStyle}
                      />
                    )}
                    control={control}
                  />
                </Col>
                <Col style={{ marginRight: 15, width: 110, marginLeft: 30 }}>
                  mapping
                </Col>
                <Col>
                  <Controller
                    name={`ioSetup.${index}.diMapping` as const}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <InputNumber
                        onChange={onChange}
                        value={value}
                        size="small"
                        style={inputStyle}
                      />
                    )}
                    control={control}
                  />
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </Card>
    </form>
  );
}

export default LMHDIOSetup;
