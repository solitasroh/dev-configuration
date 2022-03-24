import { usePolling } from '@src/application/hooks/ipcHook';
import MismatchState from '@src/Data/MismatchState';
import { Card } from 'antd';
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
type MismatchProps = {
  status: boolean;
};
const MismatchContainer = styled.div`
  background-color: white;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;
const MismatchContainer1 = styled.div`
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
export default function MismatchDetailView(): ReactElement {
  const [missMatchType, setMissMatchType] = useState('');
  usePolling(
    {
      requestType: 'MissMatchState',
      responseChannel: 'POLL-MISSMATCH-STATE',
    },
    (evt, resp) => {
      const missMatchStatus = resp as MismatchState;
      if (missMatchStatus !== null && missMatchStatus !== undefined) {
        setMissMatchType(missMatchStatus.missMatchType);
      }
    },
    5000,
  );
  return (
    <Card
      title="Mismatch Detail.."
      size="small"
      style={{ width: '300px' }}
      type="inner"
    >
      <MismatchContainer>
        <MismatchContainer1>
          <MismatchStatus status={missMatchType === 'operating state'} />
          <MismatchLabel status={missMatchType === 'operating state'}>
            operating state Mismatch
          </MismatchLabel>
        </MismatchContainer1>
        <MismatchContainer1>
          <MismatchStatus status={missMatchType === 'LMH DI'} />
          <MismatchLabel status={missMatchType === 'LMH DI'}>
            LMH DI Mismatch
          </MismatchLabel>
        </MismatchContainer1>
        <MismatchContainer1>
          <MismatchStatus status={missMatchType === 'LMH DO'} />
          <MismatchLabel status={missMatchType === 'LMH DO'}>
            LMH DO Mismatch
          </MismatchLabel>
        </MismatchContainer1>
        <MismatchContainer1>
          <MismatchStatus status={missMatchType === 'IOH ID'} />
          <MismatchLabel status={missMatchType === 'IOH ID'}>
            IOH ID Mismatch
          </MismatchLabel>
        </MismatchContainer1>
        <MismatchContainer1>
          <MismatchStatus status={missMatchType === 'IOH TYPE'} />
          <MismatchLabel status={missMatchType === 'IOH TYPE'}>
            IOH TYPE Mismatch
          </MismatchLabel>
        </MismatchContainer1>
        <MismatchContainer1>
          <MismatchStatus status={missMatchType === 'IOH IO Status'} />
          <MismatchLabel status={missMatchType === 'IOH IO Status'}>
            IOH IO Status Mismatch
          </MismatchLabel>
        </MismatchContainer1>
      </MismatchContainer>
    </Card>
  );
}
