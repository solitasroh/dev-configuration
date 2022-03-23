import React, { ReactElement, useState } from 'react';
import { Card, Divider } from 'antd';

import MeasureData from '@src/Data/MeasureData';
import { usePolling } from '@src/application/hooks/ipcHook';

import styled from 'styled-components';

type DIProps = {
  Status: boolean;
};
type props = {
    id: number;
  };
  
const Container = styled.div`
  column-count: 2; /* 화면을 count수 만큼 나눈다. */
  column-width: 10px; /* 폭에 맞춰서 단을 맞춰준다. */
  column-gap: 10px; /* 컬럼과 컬럼사이의 간격 */
`;
const DIOContainer = styled.div`
  display: flex;
`;
const DIOContentsWrapper = styled.div`
  display: flex;
  font-family: 'Roboto', serif;
  font-style: normal;
  font-weight: 600;
  align-items: center;
`;
const DIOStatusIcon = styled.div<DIProps>`
  align-items: center;
  border-radius: 4px;
  width: 35px;
  height: 9.18px;
  background-color: ${(props) => (props.Status ? '#40AB64' : '#CACACA')};
`;
const ChannelLabel = styled.div<DIProps>`
  display: flex;
  justify-content: flex-start;
  font-size: 9px;
  padding: 0.2em;
  color: ${(props) => (props.Status ? '#716D6D' : '#CACACA')};
`;
export default function IOHDIDetailView({ id}: props): ReactElement {
  const [measureData, setMeasureData] = useState<MeasureData<boolean>>();
  const [doStatus, setDoData] = useState<MeasureData<boolean>>();

  usePolling(
    {
      responseChannel: 'POLL-IO-DI-Data',
      requestType: 'IODIData',
      props: {
        id,
      },
    },
    (evt, resp) => {
      const data = resp as MeasureData<boolean>;
      setMeasureData(data);
    },
    300,
  );

  usePolling(
    {
      responseChannel: 'POLL-IO-DO-Data',
      requestType: 'IODOData',
      props: {
        id,
      },
    },
    (evt, resp) => {
      const data = resp as MeasureData<boolean>;
      setDoData(data);
    },
    1000,
  );

  return (
    <Card title="Digital IO Status" type="inner" >
      <DIOContainer>
        <Container>
          {measureData?.detail.map((measure, index) => (
            <DIOContentsWrapper>
              {' '}
              <ChannelLabel Status={measure.value}>
                DI {(index + 1).toString().padStart(2, '0')}
              </ChannelLabel>
              <DIOStatusIcon Status={measure.value} />
            </DIOContentsWrapper>
          ))}
        </Container>
        <Divider type = "vertical" style={{height:"100%"}}/>
        <div>
          {doStatus?.detail.map((measure, index) => (
            <DIOContentsWrapper>
              {' '}
              <ChannelLabel Status={measure.value}>
                DO {(index + 1).toString().padStart(2, '0')}
              </ChannelLabel>
              <DIOStatusIcon Status={measure.value} />
            </DIOContentsWrapper>
          ))}
        </div>
      </DIOContainer>
    </Card>
  );
}
