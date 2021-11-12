import React, { FC } from 'react';
import LDInformationView from './LDInformationView';
import LMInformationView from './LMInformationView';

const LMMain : FC = () => (
    <div>
      <LMInformationView />
      <LDInformationView />
    </div>
  );

export default LMMain;
