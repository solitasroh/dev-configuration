import { GiftOutlined } from '@ant-design/icons';
import { usePolling } from '@src/application/hooks/ipcHook';
import IOHInfoData from '@src/Data/IOHInfoData';
import { Popover } from 'evergreen-ui';
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import IOHAIStatus from '../ioh/IOHAIStatus';
import IOHDIDetailView from '../ioh/IOHIODetailView';
import LMHDIDetailView from './LMHDIDetailView';
import LMHDIStatus from './LMHDIStatus';

type MismatchProps = {
  status: boolean;
};
type OpreationgProps = {
  status: boolean;
};
const Container = styled.div`
  width: 320px;
  height: 200px;
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
const LMHContainer = styled.div`
  background-color: white;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: space-between;
  flex-direction : column; 
  padding: 0.2em;
}
`;
const IOHContainer = styled.div`
  background-color: white;
  display: grid;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: space-between;
  padding: 0.2em;
  gap: 10px;
  grid-template-columns: repeat(5, 1fr);
 }
`;
const LMHStatus = styled.div`
  width: 100px;
  height: 40px;
  left: 6px;
  top: 37px;
  background: #f3abb6;
  border: 0.4px solid #e0e0e0;
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  padding: 0.2em;
  flex-direction: column;
`;
const IOHStatus = styled.div<OpreationgProps>`
  width: 50px;
  height: 35px;
  left: 6px;
  top: 72px;

  background: ${(props) => (props.status === true ? '#ffcad4' : '#CACACA')};
  border: 0.4px solid #e0e0e0;
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  padding: 0.2em;
  flex-direction: column;
`;
const ItemsLabel = styled.div`
  padding: 0.2em;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 7px;
`;

const ItemsIcon = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 2;
  align-items: flex-end;
  cursor: pointer;
`;
const HeaderLabel = styled.div`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
`;
const MismatchContainer = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
`;
const MismatchLabel = styled.div<MismatchProps>`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  color: ${(props) => (props.status === true ? '#29C141' : '#CACACA')};
`;
const MismatchStatus = styled.div<MismatchProps>`
  width: 17px;
  height: 7px;
  border-radius: 4px;
  margin-right: 3px;
  background-color: ${(props) =>
    props.status === true ? '#29C141' : '#CACACA'};
`;
const Mismatch = ({ status }: { status: boolean }) => (
  <MismatchContainer>
    <MismatchStatus status={status} />
    <MismatchLabel status={status}>Mismatch</MismatchLabel>
  </MismatchContainer>
);
type Props = {
  unitInfo: {
    key: number;
    id: number;
  }[];
};

export default function LocalUnitBox({ unitInfo }: Props): ReactElement {
  const [mismatch, setMismatch] = useState(false);
  const [operation, setOperation] = useState<boolean[]>([]);
  
  const [information, setInformation] = useState<IOHInfoData[]>([]);
  
  usePolling(
    {
      responseChannel: 'POLL-IO-information',
      requestType: 'A2750IOInformation',
      props: { id: 0 },
    },
    (evt, rest) => {
      const infoList = rest as IOHInfoData[];
      const validIO = [];

      for (let i = 0; i < 15; i+=1) {
        if (infoList[i].operationStatus === 'OPERATING') validIO.push(true);
        else validIO.push(false);
      }
      setOperation(validIO);
      setInformation(infoList);
    },
    1000,
  );
  return (
    <Container>
      <HeadContainer>
        <HeaderLabel>NO. 1 GSP</HeaderLabel>
        <Mismatch status={mismatch} />
      </HeadContainer>
      <LMHContainer>
        <LMHStatus>
          <ItemsLabel>LMH</ItemsLabel>
          <ItemsIcon>
            <Popover
              trigger="click"
              minWidth={300}
              content={() => <LMHDIDetailView />}
            >
              <GiftOutlined />
            </Popover>
          </ItemsIcon>
        </LMHStatus>
        <IOHContainer>
          {unitInfo.map((value, index) => (
            <IOHStatus status={operation[index]}>
              <ItemsLabel>IOH {value.id}</ItemsLabel>
              <ItemsIcon>
                {operation[index] === true ? (
                  <Popover
                    trigger="click"
                    minWidth={300}
                    content={() => information[index]?.moduleType === 'DIO' ? <IOHDIDetailView id={index + 1} /> : <IOHAIStatus id={index+1}/>}
                  >
                    <GiftOutlined />
                  </Popover>
                ) : null}
              </ItemsIcon>
            </IOHStatus>
          ))}
        </IOHContainer>
      </LMHContainer>
    </Container>
  );
}
