import React, { FC } from 'react';

interface Props {
  id: number;
}

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

interface DetailData {
  id: number;
  remoteMode: boolean;
  abnormal: boolean;
  faultStatus: boolean;
  diStatus: boolean[];
  doStatus: boolean[];
  generaDISetup: string[];
  currentDISetup: number[];
}

const data: DetailData = {
  id: 1,
  remoteMode: false,
  abnormal: true,
  faultStatus: false,
  diStatus: [true, true, false, false, true, true, true, false, false, false],
  doStatus: [true, false, false, false],
  generaDISetup: ['G-DIO1', 'G-DIO2'],
  currentDISetup: [6, 0, 0, 0, 4, 13, 0, 0, 1, 3],
};

const MotorUnitDetailView: FC<Props> = ({ id }) => {
  return <div>{id}</div>;
};

export default MotorUnitDetailView;
