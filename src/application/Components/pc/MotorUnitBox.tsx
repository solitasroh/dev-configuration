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
}

const Container = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 4px;
  flex-direction: column;
  width: 180px;
  max-height: 66px;
  border: 1px solid #e0e0e0;
  justify-content: space-between;
  margin: 3px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 10px;
  margin-bottom: 5px;
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

const HeaderTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-wrap: none;
  text-overflow: ellipsis;

  white-space: nowrap;
  overflow: hidden;
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
    props.operationMode === 4 ? '#66d45a' : '#efc1c1'};
  border-radius: 2px;
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
  <HeaderContainer>
    <HeaderTitle>{mccName}</HeaderTitle>
    {data !== null ? (
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
        <HeaderId operationMode={operationMode}>ID {id.toString(10)}</HeaderId>
      </Popover>
    ) : (
      <HeaderId operationMode={operationMode}>ID {id.toString(10)}</HeaderId>
    )}
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
  <ButtonContainer onClick={() => command()}>
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

const MotorUnitBox: FC<Props> = ({ id }) => {
  console.log('motor unit box');
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
        setName(setup.name);
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
    console.log('write run command');
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

  return (
    <Container>
      <Popover
        trigger="click"
        minWidth={10}
        content={() => (
          <div>
            {' '}
            <div>test</div>
          </div>
        )}
      >
        <UnitHeader
          id={id}
          mccName={name}
          operationMode={operationMode}
          data={data}
        />
      </Popover>
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
