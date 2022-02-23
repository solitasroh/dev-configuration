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
    polarity: number;
    mapping: number;
  }[];
};

const defaultValues: LogicIOProps[] = [
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
  { polarity: 0, mapping: 12 },
  { polarity: 0, mapping: 13 },
  { polarity: 0, mapping: 14 },
  { polarity: 0, mapping: 15 },
  { polarity: 0, mapping: 16 },
  { polarity: 0, mapping: 17 },
  { polarity: 0, mapping: 18 },
  { polarity: 0, mapping: 19 },
];

function LMHDISetup(): ReactElement {
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
        requestType: 'LMLogicDISetup',
        responseChannel: 'POLL-LM-LOGIC-DI-SETUP',
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
        polarity: v.polarity,
        mapping: v.mapping,
      };
      return result;
    });

    const service = IpcService.getInstance();
    service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
      writeData: setup,
      requestType: 'LMLogicDISetup',
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
                    name={`ioSetup.${index}.polarity` as const}
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
                    name={`ioSetup.${index}.mapping` as const}
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

export default LMHDISetup;
