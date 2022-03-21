import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';

const status = ['Active', 'Standby'];
const Container = styled.div`
  width: 195px;
  height: 145;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  background: #ffffff;
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
  height: 9.18px;  
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
  font-size: 14px;
  line-height: 16px;
  display: flex;
  align-items: center;
`;
const HeaderLabel2 = styled.div<HearderProps>`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
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
  font-size: 18px;
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
const data : CoilProps = {
  ringStatus : false,
  dhConnect : false,
};
export default function IncomingUnitBox(): ReactElement {
  const [activeStatus, setActiveStatus] = useState(false);
  const [unit1Number, seUunit1Number] = useState(20);
  const [unit2Number, setUnit2Number] = useState(20);
  return (
    <Container>
      <HeadContainer>
        <HeaderLabel>Incoming Name</HeaderLabel>
        <HeaderLabel2 status={activeStatus}>
          {activeStatus === true ? status[0] : status[1]}
        </HeaderLabel2>
      </HeadContainer>
      <MiddleContainer>
        <UnitContatiner>
          <HeaderLabel>UNIT 01</HeaderLabel>
          <UnitLabel>{unit1Number}</UnitLabel>
        </UnitContatiner>
        <UnitContatiner>
          <HeaderLabel>UNIT 02</HeaderLabel>
          <UnitLabel>{unit2Number}</UnitLabel>
        </UnitContatiner>
      </MiddleContainer>
      <BottomContainer>
        <BottomContainer1>
          <BottomStatus status={data.ringStatus} />
          <BottomLabel status={data.ringStatus}>
            Module Ring broken
          </BottomLabel>
        </BottomContainer1>
        <BottomContainer1>
          <BottomStatus status={data.dhConnect} />
          <BottomLabel status={data.dhConnect}>
            A2750LDH Disconnect
          </BottomLabel>
        </BottomContainer1>
      </BottomContainer>
    </Container>
  );
}
