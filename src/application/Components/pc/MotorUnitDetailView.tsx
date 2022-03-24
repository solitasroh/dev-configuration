import React, { FC, ReactElement, useState } from 'react';
import styled from 'styled-components';
import { usePolling } from '@src/application/hooks/ipcHook';
import IOHInfoData from '@src/Data/IOHInfoData';
import MotorUnitStatusData from '@src/Data/MotorUnitStatus';

/// TODO:  설정 데이터를 통해 아래 배열에서 참조하여 화면 표시해야함
const DISetupDefinition = [
  'No Use', // 0
  'RUN1', // 1
  'RUN2', // 2
  'STOP', // 3
  'Remote Select', // 4
  'OFF Select', // 5
  'RUN1 Status', // 6
  'RUN2 Status', // 7
  'Emergency Start', // 8
  'Fault Reset', // 9
  'Reserved',
  'MCCB Trip/', // 11
  'External Alarm', // 12
  'Control Power Monitoring', // 13
  'MCCB Trip INV/', // 14
  'INV RUN1 Status', // 15
  'INV RUN2 Status', // 16
  'INV Fault1',
  'INV Fault2',
];

/// TODO: 101 ~ 115 까지 의 값으로 맵핑됨 (, 아래 배열 인덱스 - 101 을 해야함)
const GeneraDIDefinition = [
  'General DI1',
  'General DI2',
  'General DI3',
  'General DI4',
  'General DI5',
  'General DI6',
  'General DI7',
  'General DI8',
  'General DI9',
  'General DI10',
];

const DOSetupDefinition = [
  'No Use',
  'RUN1',
  'RUN2',
  'Alarm',
  'Fault',
  'INV RUN1',
  'INV RUN2',
];
// 101 ~ 113
const GeneralDODefinition = [
  'General DO1',
  'General DO2',
  'General DO3',
  'General DO4',
];

interface Props {
  id: number;
  operationMode: number;
  data: MotorUnitStatusData;
}

type BoxProps = {
  sts: boolean;
  setup: number;
  ch: number;
};
type HeaderProps = {
  operationMode: number;
};
type FaultProps = {
  fault: boolean;
};
type DIProps = {
  Status: boolean;
};

const Container = styled.div`
  display: flex;
  background-color: #ffffff;
  border: 0.5px solid rgba(0, 0, 0, 0.7);
  box-shadow: 3px 4px 3px 1px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  flex-direction: column;
  justify-content: space-between;
  margin: 3px;
`;

const HeaderContainer = styled.div`
  background-color: white;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0.2em;
  overflow-wrap: unset;
`;

const MiddleContainer = styled.div`
  background-color: white;
  display: flex;
  flex-wrap: nowrap;
  padding: 0.2em;
  justify-content: space-between;
`;

const MiddleContainer1 = styled.div`
  background-color: white;
  display: flex;
  flex-wrap: nowrap;
  padding: 0.2em;
  width: 100%;
  justify-content: space-between;
`;

const HeaderTitle = styled.div`
  font-family: 'Roboto', serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
`;

const HeaderId = styled.div<HeaderProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  text-wrap: none;
  font-weight: 600;
  width: 32px;
  height: 15px;
  font-family: Roboto, ui-serif;
  border-radius: 2px;
  background-color: ${(props) =>
    props.operationMode === 4 ? '#40AB64' : '#DF6A51'};
`;

const MiddleText = styled.div`
  font-size: 9px;
  padding: 0.2em;
  align-items: flex-start;
  text-wrap: none;
`;

const Middle = styled.div`
  display: flex;
  font-family: 'Roboto', serif;
  font-style: normal;
  font-weight: 600;
  font-size: 8px;
  line-height: 9px;
  flex-direction: column;
`;

const Middle1 = styled.div`
  display: flex;
  font-family: 'Roboto', serif;
  font-style: normal;
  font-weight: 600;
  font-size: 8px;
  line-height: 9px;
  align-items: center;
  justify-content: space-between;
`;

const MiddleFaultStatus = styled.div<FaultProps>`
  align-items: center;
  border-radius: 10px;
  width: 8px;
  height: 9px;
  background-color: ${(props) => (props.fault ? '#40AB64' : '#DF6A51')};
`;

const DIOStatusIcon = styled.div<DIProps>`
  align-items: center;
  border-radius: 4px;
  width: 35px;
  height: 9.18px;
  background-color: ${(props) => (props.Status ? '#40AB64' : '#DF6A51')};
`;

const FaultStatus = ({ status }: { status: boolean }) => (
  <Middle>
    <Middle1>
      <MiddleFaultStatus fault={status === true} />
      <MiddleText>OCR Fault</MiddleText>
    </Middle1>
    <Middle1>
      <MiddleFaultStatus fault={status === true} />
      <MiddleText>Abnormal</MiddleText>
    </Middle1>
  </Middle>
);

const RemoteMode = ({ mode }: { mode: boolean }) => (
  <MiddleText>{mode === true ? 'Remote Mode' : 'Local Mode'}</MiddleText>
);

type DIOSetupProps = {
  invalid: boolean;
};

const DIOBoxContainer = styled.div`
  display: flex;
  font-family: 'Roboto', serif;
  font-style: normal;
  font-weight: 600;
  line-height: 9px;
  flex-direction: column;
  width: 100%;
`;

const DIOContentsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  font-family: 'Roboto', serif;
  font-style: normal;
  font-weight: 600;
  align-items: center;
  justify-content: space-between;
`;

const DIOSetupLabel = styled.div<DIOSetupProps>`
  display: flex;
  font-size: 12px;
  padding: 0.2em;
  align-items: flex-start;
  color: ${(props) => (props.invalid ? '#CACACA' : '#716D6D')};
  margin: 1px 0;
`;

const ChannelLabel = styled.div<DIOSetupProps>`
  display: flex;
  justify-content: flex-end;
  font-size: 9px;
  padding: 0.2em;
  color: ${(props) => (props.invalid ? '#CACACA' : '#716D6D')};
`;

function DIBox({ data }: { data: MotorUnitStatusData }): ReactElement {
  const array: BoxProps[] = data.diStatus.map((value, index) => {
    const result: BoxProps = {
      sts: value,
      ch: index + 1,
      setup: data.diSetup[index],
    };
    return result;
  });

  return (
    <DIOBoxContainer>
      <div style={{ fontSize: '11px', margin: '5px 0' }}>DI Status</div>
      {array.map((value, index) => (
        <DIOContentsWrapper key={index}>
          <DIOStatusIcon Status={value.sts} />
          <DIOSetupLabel invalid={value.setup === 0}>
            {value.setup < 101
              ? DISetupDefinition[value.setup]
              : data.generalDIData[value.setup - 101]}
          </DIOSetupLabel>
          <ChannelLabel invalid={value.setup === 0}>
            CH {(index + 1).toString().padStart(2, '0')}
          </ChannelLabel>
        </DIOContentsWrapper>
      ))}
    </DIOBoxContainer>
  );
}
function DOBox({ data }: { data: MotorUnitStatusData }): ReactElement {
  const array: BoxProps[] = data.doStatus.map((value, index) => {
    const result: BoxProps = {
      sts: value,
      ch: index + 1,
      setup: data.doSetup[index],
    };
    return result;
  });

  return (
    <DIOBoxContainer>
      <div style={{ fontSize: '11px', margin: '5px 0' }}>DO Status</div>
      {array.map((value, index) => (
        <DIOContentsWrapper key={index}>
          <DIOStatusIcon Status={value.sts} />
          <DIOSetupLabel invalid={value.setup === 0}>
            {value.setup < 101
              ? DOSetupDefinition[value.setup]
              : data.generalDOData[value.setup - 101]}
          </DIOSetupLabel>
          <ChannelLabel invalid={value.setup === 0}>
            CH {(index + 1).toString().padStart(2, '0')}
          </ChannelLabel>
        </DIOContentsWrapper>
      ))}
    </DIOBoxContainer>
  );
}

const MotorUnitDetailView: FC<Props> = ({ id, operationMode, data }) => {
  return (
    <Container>
      <HeaderContainer>
        <HeaderTitle>Detail</HeaderTitle>
        <HeaderId operationMode={operationMode}>ID {id}</HeaderId>
      </HeaderContainer>
      <MiddleContainer>
        <FaultStatus status={data.faultStatus} />
        <RemoteMode mode={data.controlMode === 1} />
      </MiddleContainer>
      <MiddleContainer1>
        <DIBox data={data} />
      </MiddleContainer1>
      <MiddleContainer1>
        <DOBox data={data} />
      </MiddleContainer1>
    </Container>
  );
};

export default MotorUnitDetailView;
