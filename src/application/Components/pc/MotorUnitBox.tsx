import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

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
  name: string;
  controlMode: string;
  motorStatus: string;
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
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const HeaderContainer = styled.div`
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

const HeaderId = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  text-wrap: none;
  font-weight: 600;
  width: 35px;
  font-family: Roboto, ui-serif;
  background-color: #efc1c1;
  border-radius: 2px;
`;

const UnitHeader = ({ mccName, id }: { mccName: string; id: number }) => (
  <HeaderContainer>
    <HeaderTitle>{mccName}</HeaderTitle>
    <HeaderId>ID {id.toString(10)}</HeaderId>
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

const ControlButton = ({ status, children }: Prop) => (
  <ButtonContainer>
    <ButtonStatus status={status} />
    <ButtonContents>{children}</ButtonContents>
  </ButtonContainer>
);
const ControlCommand = ({ motorStatus }: { motorStatus: string }) => (
  <ButtonContainer>
    <ControlButton status={motorStatus === MotorStatusDefinition.Run}>
      RUN
    </ControlButton>
    <ControlButton status={motorStatus === MotorStatusDefinition.Stop}>
      STOP
    </ControlButton>
  </ButtonContainer>
);

const MotorUnitBox: FC<Props> = ({ id, name, controlMode, motorStatus }) => {
  console.log('motor unit box');
  return (
    <Container>
      <UnitHeader id={id} mccName={name} />
      <Bottom>
        <ControlMode controlMode={controlMode} />
        <ControlCommand motorStatus={motorStatus} />
      </Bottom>
    </Container>
  );
};

export default MotorUnitBox;
