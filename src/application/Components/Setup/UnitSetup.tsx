import React from 'react';
import { Card, Col, Row } from 'antd';
import styled from 'styled-components';
import { MainSetup } from '@src/application/Components/Setup/SetupContents';
import SetupData from '@src/application/Components/Setup/DummyData';

const Cell = styled(Col)`
  background-color: darkgray;
  padding: 10px;
`;

export default function UnitSetup(): JSX.Element {
  return (
    <div>
      {' '}
      Unit Setup
      <MainSetup categories={SetupData} />
      <Row>
        <Cell flex={1} />
      </Row>
    </div>
  );
}
