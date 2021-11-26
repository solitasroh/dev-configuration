import MismatchState from '@src/Data/MismatchState';
import { Space } from 'antd';
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import { usePolling } from '../../hooks/ipcHook';

const Label = styled.p`
  text-align: left;
  font-size: 8pt;
`;

const Value = styled.div`
  text-align: center;
  align-items: center;
  font-weight: 600;
  font-size: 9pt;
  color: #d8d8d8;
  padding: 4px;
`;

export default function MissmatchInfo(): ReactElement {
  const [info, setInfo] = useState('');
  const [alarm, setAlarm] = useState(false);
  const [detail1, setDetailLM1] = useState('');
  const [detail2, setDetailLM2] = useState('');

  usePolling(
    {
      requestType: 'MissMatchState',
      responseChannel: 'POLL-MISSMATCH-STATE',
    },
    (evt, resp) => {
      const missMatchStatus = resp as MismatchState;
      if (missMatchStatus !== null && missMatchStatus !== undefined) {
        setInfo(missMatchStatus.missMatchType);
        setAlarm(missMatchStatus.missMatchAlarm);
        setDetailLM1(missMatchStatus.detailType1);
        setDetailLM2(missMatchStatus.detailType2);
      }
    },
    1000,
  );

  return (
    <Space
      style={{
        backgroundColor: '#fc6e5c',
        paddingLeft: 10,
        height: 26,
        marginLeft: 10,
      }}
    >
      <p style={{ fontSize: '15px', fontWeight: 600 }}>
        {alarm ? 'Missmatch' : 'No missmatch'}
      </p>
      <Label>lastest MissMatch Type</Label>
      <Value>{info}</Value>
      <Label>LM1</Label>
      <Value>{detail1}</Value>
      <Label>LM2</Label>
      <Value>{detail2}</Value>
    </Space>
  );
}
