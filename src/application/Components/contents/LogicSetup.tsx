import { Button, Tabs } from 'antd';
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import LMHDISetup from '@src/application/Components/lmh/LMHDISetup';
import LMHDOSetup from '@src/application/Components/lmh/LMHDOSetup';
import DIOSetupPage from '@src/application/Components/ioh/DIOSetupPage';
import LMHUserDefine from '../lmh/LMHUserDefine';
import LMHDIOSetupPage from '@src/application/Components/lmh/LMHDIOSetupPage';

const { TabPane } = Tabs;
const UserButton = styled(Button)`
  margin-right: 10px;
`;
export default function LogicSetupContents(): ReactElement {
  return (
    <>
      <Tabs type="card">
        {/*<TabPane tab="LMH" key="1">*/}
        {/*  <LMHDISetup />*/}
        {/*  <LMHDOSetup />*/}
        {/*</TabPane>*/}
        <TabPane tab="Logic IO" key="1">
          {/*<UserButton> ALL </UserButton>*/}
          {/*<UserButton> Each </UserButton>*/}
          <div style={{ display: 'flex'}}>
            <LMHDIOSetupPage />
            <DIOSetupPage moduleId={1} />
            <DIOSetupPage moduleId={2} />
          </div>
        </TabPane>
        <TabPane tab="LMH Geneal DIO" key="2">
          <LMHUserDefine />
        </TabPane>
      </Tabs>
    </>
  );
}
