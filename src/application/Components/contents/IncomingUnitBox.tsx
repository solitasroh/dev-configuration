import { IncomingStatus } from '@src/main/modbus.a2700m/m/RegisterIncomingStatus';
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';

const status = ['Active', 'Standby'];
const Container = styled.div`
  width:250px;
  height: auto;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  background: #ffffff;
  padding: 5px;
`;

const HeadContainer = styled.div`
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
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10px;
`;
const UnitContatiner = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
`;
const BottomContainer = styled.div`
  background-color: white;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: flex-start;
  margin-top: 10px;
  flex-direction: column;
`;
const BottomContainer1 = styled.div`
  background-color: white;
  display: flex;
  padding: 0.2em;
  align-items: center;
`;
const BottomStatus = styled.div<BottomProps>`
  width: 35px;
  height: 10px;
  border-radius: 4px;
  margin-right: 3px;
  background-color: ${(props) =>
    props.status === true ? '#29C141' : '#CACACA'};
`;

type HearderProps = {
  status: boolean;
};
type BottomProps = {
  status: boolean;
};
type CoilProps = {
  ringStatus: boolean;
  dhConnect: boolean;
};

const HeaderLabel = styled.div`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 16px;
  display: flex;
  align-items: center;
`;

const UnitHeaderLabel = styled.div`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 16px;
  display: flex;
  align-items: center;
`;

const ActiveStatusLabel = styled.div<HearderProps>`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: ${(props) => (props.status === true ? '#29C141' : '#ffaa79')};
`;
const UnitLabel = styled.div`
  margin-top: 5px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 14px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;
const BottomLabel = styled.div<BottomProps>`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => (props.status === true ? '#29C141' : '#CACACA')};
`;

type Props = {
  incommingInfo: IncomingStatus;
};

export default function IncomingUnitBox({
  incommingInfo,
}: Props): ReactElement {
  return (
    <Container>
      <HeadContainer>
        <HeaderLabel>{incommingInfo?.mccName}</HeaderLabel>
        <ActiveStatusLabel status={incommingInfo?.ActiveState}>
          {incommingInfo?.ActiveState === true ? status[0] : status[1]}
        </ActiveStatusLabel>
      </HeadContainer>
      <MiddleContainer>
        <UnitContatiner>
          <UnitHeaderLabel>UNIT 01</UnitHeaderLabel>
          <UnitLabel>{incommingInfo?.Port1Count}</UnitLabel>
        </UnitContatiner>
        <UnitContatiner>
          <UnitHeaderLabel>UNIT 02</UnitHeaderLabel>
          <UnitLabel>{incommingInfo?.Port2Count}</UnitLabel>
        </UnitContatiner>
      </MiddleContainer>
      <BottomContainer>
        <BottomContainer1>
          <BottomStatus status={incommingInfo?.ModuleRingBroken} />
          <BottomLabel status={incommingInfo?.ModuleRingBroken}>
            Module Ring broken
          </BottomLabel>
        </BottomContainer1>
        <BottomContainer1>
          <BottomStatus status={incommingInfo?.A2700DHDisconnected} />
          <BottomLabel status={incommingInfo?.A2700DHDisconnected}>
            A2700DH Disconnect
          </BottomLabel>
        </BottomContainer1>
      </BottomContainer>
    </Container>
  );
}
