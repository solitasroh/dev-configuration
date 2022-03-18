import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';

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
}

type BoxProps = {
  sts: boolean;
  setup: number;
  ch: number;
};
type HeaderProps = {
  operationMode: number;
};
type FalutProps = {
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
  width: 257px;
  max-height: 303px;
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
  font-family: 'Roboto';
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
  background-color: white;
  border-radius: 2px;
  background-color: ${(props) =>
    props.operationMode === 4 ? '#40AB64' : '#DF6A51'};
`;

const MiddleText = styled.div`
  font-size: 9px;
  padding: 0.2em;
  align-items: flex-start;
`;
const Middle = styled.div`
  display: flex;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 8px;
  line-height: 9px;
  flex-direction: column;
`;
const Middle1 = styled.div`
  display: flex;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 8px;
  line-height: 9px;
  align-items: center;
  justify-content: space-between;
  ${MiddleText} {
    width: 70%;
  }
`;
const Middle2 = styled.div`
  display: flex;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 8px;
  line-height: 9px;
  flex-direction: column;
  width: 100%;
`;
const MiddleFaultStatus = styled.div<FalutProps>`
  align-items: center;
  border-radius: 10px;
  width: 8px;
  height: 9px;
  background-color: ${(props) => (props.fault ? '#40AB64' : '#DF6A51')};
`;

const UseText = styled.div<DIProps>`
  font-size: 9px;
  padding: 0.2em;
  color: ${(props) => (props.Status ? '#716D6D' : '#CACACA')};
`;
const MiddleDIStatus = styled.div<DIProps>`
  align-items: center;
  border-radius: 4px;
  width: 35px;
  height: 9.18px;
  background-color: ${(props) => (props.Status ? '#40AB64' : '#DF6A51')};
`;
const MiddleDOStatus = styled.div<DIProps>`
  align-items: center;
  border-radius: 4px;
  width: 13px;
  height: 9px;
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

function DIBox({ data }: { data: DetailData }): ReactElement {
  const array: BoxProps[] = data.diStatus.map((value, index) => {
    const result: BoxProps = {
      sts: value,
      ch: index + 1,
      setup: data.currentDISetup[index],
    };
    return result;
  });

  return (
    <Middle2>
      {array.map((value, index) => (
        <Middle1>
          <MiddleDIStatus Status={value.sts} />
          <MiddleText>{DISetupDefinition[value.setup]}</MiddleText>
          <UseText Status={value.sts}>CH {index + 1}</UseText>
        </Middle1>
      ))}
    </Middle2>
  );
}
function DOBox({ data }: { data: DetailData }): ReactElement {
  const array: BoxProps[] = data.doStatus.map((value, index) => {
    const result: BoxProps = {
      sts: value,
      ch: index + 1,
      setup: data.currentDOSetup[index],
    };
    return result;
  });

  return (
    <Middle2>
      {array.map((value, index) => (
        <Middle1>
          <MiddleDIStatus Status={value.sts} />
          <MiddleText>{DOSetupDefinition[value.setup]}</MiddleText>
          <UseText Status={value.sts}>CH {index + 1}</UseText>
        </Middle1>
      ))}
    </Middle2>
  );
}
interface DetailData {
  id: number;
  remoteMode: boolean;
  abnormal: boolean;
  faultStatus: boolean;
  diStatus: boolean[];
  doStatus: boolean[];
  generaDISetup: string[];
  currentDISetup: number[];
  currentDOSetup: number[];
}

const data: DetailData = {
  id: 1,
  remoteMode: true,
  abnormal: true,
  faultStatus: false,
  diStatus: [true, true, false, false, true, true, true, false, false, false],
  doStatus: [true, false, false, false],
  generaDISetup: ['G-DIO1', 'G-DIO2'],
  currentDISetup: [6, 0, 0, 0, 4, 13, 0, 0, 1, 3],
  currentDOSetup: [1, 2, 3, 4],
};

const MotorUnitDetailView: FC<Props> = ({ id, operationMode }) => (
  <Container>
    <HeaderContainer>
      <HeaderTitle>Detail</HeaderTitle>
      <HeaderId operationMode={operationMode}>ID {id}</HeaderId>
    </HeaderContainer>
    <MiddleContainer>
      <FaultStatus status={data.faultStatus} />
      <RemoteMode mode={data.remoteMode} />
    </MiddleContainer>
    <MiddleContainer1>
      <DIBox data={data} />
    </MiddleContainer1>
    <MiddleContainer1>
      <DOBox data={data} />
    </MiddleContainer1>
  </Container>
);

export default MotorUnitDetailView;
