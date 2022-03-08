import { InfoSignIcon } from 'evergreen-ui';
import React, { FC } from 'react';
import styled from 'styled-components';

interface Props {
  max: number;
  min: number;
  error: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: hsl(232.8, 17%, 27%);
  margin: 0;
  min-height: 40px;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  font-size: 12pt;
`;
const HeaderBox = styled.div`
  display: flex;
  align-items: center;
`;
const Header = styled.p`
  font-size: 9pt;
  color: white;
`;

const Value = styled.p`
  font-size: 8pt;
  color: white;
`;

const ValueRange: FC<Props> = ({ max, min, error }: Props) => (
  <Container>
    <HeaderBox>
      <InfoSignIcon color="info" marginRight={3} size={10} />
      <Header>Value Range</Header>
    </HeaderBox>
    <Value>{`min : ${min} max: ${max}`}</Value>
    <Value>{error}</Value>
  </Container>
);

export default ValueRange;
