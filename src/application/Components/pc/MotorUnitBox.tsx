import React, { FC, ReactNode, useState } from 'react';
import styled from 'styled-components';
import { usePolling } from '@src/application/hooks/ipcHook';
import MotorUnitStatusData, {
  MotorUnitStatus,
} from '@src/Data/MotorUnitStatus';
import IpcService from '@src/main/IPCService';
import { WRITE_REQ } from '@src/ipcChannels';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';
import PCCommand from '@src/Data/PCCommand';
import { Popover } from 'evergreen-ui';
import MotorUnitDetailView from '@src/application/Components/pc/MotorUnitDetailView';
import { ProfileOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

export const ControlModeDefinition = {
  Local: 'LOCAL',
  Remote: 'REMOTE',
} as const;

export const MotorStatusDefinition = {
  Run: 'RUN',
  Stop: 'STOP',
};

interface Props {
  id: number;
  onClick: (id: number) => void;
}

const Container = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 4px;
  flex-direction: column;
  width: 150px;
  height: fit-content;
  border: 1px solid #e0e0e0;
  //justify-content: space-between;
  margin: 3px;
  padding: 2px;
  :hover {
    border-color: #102010;
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 6px;
  margin-bottom: 3px;
`;

const Middle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  font-family: 'Roboto', serif;
  font-weight: 400;
  margin-left: 2px;
`;

const HeaderContainer = styled.div`
  background-color: white;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-left: 2px;
  margin-right: 2px;
  overflow-wrap: unset;
`;

const HeaderTitle = styled.div`
  flex: 1;
  font-size: 13px;
  font-family: 'Roboto', serif;
  font-weight: 600;
  text-wrap: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-left: 5px;
`;
type HeaderProps = {
  operationMode: number;
};
const HeaderId = styled.div<HeaderProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  text-wrap: none;
  font-weight: 600;
  width: 35px;
  font-family: Roboto, ui-serif;
  background-color: ${(props) =>
    props.operationMode === 4 ? '#66d45a' : '#CACACA'};
  border-radius: 2px;
`;
const DetailIcon = styled(ProfileOutlined)`
  cursor: pointer;
`;
const UnitHeader = ({
  mccName,
  id,
  operationMode,
  data,
}: {
  mccName: string;
  id: number;
  operationMode: number;
  data: MotorUnitStatusData;
}) => (
  <HeaderContainer onClick={(e) => e.stopPropagation()}>
    {data?.operationMode === 4 ? (
      <Popover
        trigger="click"
        minWidth={10}
        content={() => (
          <MotorUnitDetailView
            id={id}
            operationMode={operationMode}
            data={data}
          />
        )}
      >
        <DetailIcon />
      </Popover>
    ) : null}
    <Tooltip title={mccName}>
      <HeaderTitle>
        {mccName} [{data?.UnitType}]
      </HeaderTitle>
    </Tooltip>
    <HeaderId operationMode={operationMode}>ID {id.toString(10)}</HeaderId>
  </HeaderContainer>
);

const ControlModeContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 9px;
  font-family: Roboto, ui-serif;
  font-weight: 800;
  padding: 0.2em;
`;
type ControlModeProps = {
  activated: boolean;
  activeColor: string;
};

const ControlModeStatus = styled.div<ControlModeProps>`
  display: flex;
  justify-content: center;
  border-radius: 4px;
  height: 11px;
  width: 52px;
  line-height: 11px;
  text-align: center;
  background-color: ${(props) =>
    props.activated ? props.activeColor : '#FFFFFF'};
  color: ${(props) => (props.activated ? '#F3F3F3' : props.activeColor)};
`;

const ControlMode = ({ controlMode }: { controlMode: string }) => (
  <ControlModeContainer>
    <ControlModeStatus
      activated={controlMode === ControlModeDefinition.Local}
      activeColor="#7AE060"
    >
      LOCAL
    </ControlModeStatus>
    <ControlModeStatus
      activated={controlMode === ControlModeDefinition.Remote}
      activeColor="#E88B00"
    >
      REMOTE
    </ControlModeStatus>
  </ControlModeContainer>
);

const ButtonContainer = styled.div`
  display: flex;
  font-family: Roboto, ui-serif;
  font-weight: 500;
  font-size: 12px;
  justify-content: space-between;
  align-items: center;
`;

type Prop = {
  children: ReactNode;
  status: boolean;
  command: () => void;
};

type styledProp = {
  status: boolean;
};

const ButtonStatus = styled.div<styledProp>`
  background-color: ${(props) => (props.status ? '#DF6A51' : '#ADADAD')};
  width: 3px;
  height: 14px;
`;
const ButtonContents = styled.div`
  display: flex;
  justify-content: center;
  width: 42px;

  :hover {
    background-color: aliceblue;
  }

  :active {
    background-color: azure;
    border: 1px solid black;
  }
`;

const ControlButton = ({ status, children, command }: Prop) => (
  <ButtonContainer
    onClick={(e) => {
      e.stopPropagation();
      command();
    }}
  >
    <ButtonStatus status={status} />
    <ButtonContents>{children}</ButtonContents>
  </ButtonContainer>
);
const ControlCommand = ({
  motorStatus,
  runCommand,
  stopCommand,
}: {
  motorStatus: string;
  runCommand: () => void;
  stopCommand: () => void;
}) => (
  <ButtonContainer>
    <ControlButton
      status={motorStatus === MotorStatusDefinition.Run}
      command={runCommand}
    >
      RUN
    </ControlButton>
    <ControlButton
      status={motorStatus === MotorStatusDefinition.Stop}
      command={stopCommand}
    >
      STOP
    </ControlButton>
  </ButtonContainer>
);

const MotorUnitBox: FC<Props> = ({ id, onClick }) => {
  const [name, setName] = useState('unknown');
  const [controlMode, setControlMode] = useState('unknown');
  const [motorStatus, setMotorStatus] = useState('unknown');
  const [operationMode, setOperationMode] = useState(0);
  const [data, setData] = useState<MotorUnitStatusData>(null);

  usePolling(
    {
      requestType: 'MotorUnitStatus',
      responseChannel: `motor-unit-status-getter-${id}`,
      props: {
        id,
      },
    },
    (evt, rest) => {
      const setup = rest as MotorUnitStatusData;

      if (setup !== null) {
        setName(setup?.name);
        setControlMode(
          setup.controlMode === 1
            ? ControlModeDefinition.Remote
            : ControlModeDefinition.Local,
        );
        setMotorStatus(
          setup.motorStatus === 1
            ? MotorStatusDefinition.Run
            : MotorStatusDefinition.Stop,
        );
        setOperationMode(setup.operationMode);
      }
      setData(setup);
    },
    1000,
  );

  const run = () => {
    const data = new PCCommand();
    data.command = 1;
    data.id = id;
    if (id <= 0) {
      return;
    }
    const service = IpcService.getInstance();
    service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
      writeData: data,
      requestType: 'PCCommand',
    });
  };

  const stop = () => {
    const data = new PCCommand();
    data.command = 2;
    data.id = id;
    if (id <= 0) {
      return;
    }
    const service = IpcService.getInstance();
    service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
      writeData: data,
      requestType: 'PCCommand',
    });
  };

  const handleClick = () => {
    onClick(id);
  };

  return (
    <Container onClick={handleClick}>
      <UnitHeader
        id={id}
        mccName={name}
        operationMode={operationMode}
        data={data}
      />
      <Middle>IAvg : {data?.IAvg.toFixed(2)}A</Middle>
      <Bottom>
        <ControlMode controlMode={controlMode} />
        <ControlCommand
          motorStatus={motorStatus}
          runCommand={run}
          stopCommand={stop}
        />
      </Bottom>
    </Container>
  );
};

export default MotorUnitBox;
