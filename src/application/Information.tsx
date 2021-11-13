import React from 'react';
import styled from 'styled-components';
import LDInformationView from './lmh/LDInformationView';
import LMInformationView from './lmh/LMInformationView';

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 10px;
  width: 100%;
  height: 100%;
`;

const Information: React.FC = () => (
  <Contents>
    <LMInformationView />
    <LDInformationView />
  </Contents>
);

export default Information;
