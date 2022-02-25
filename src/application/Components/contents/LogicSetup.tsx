import { Button, Tabs } from 'antd';
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import LMHDISetup from '@src/application/Components/lmh/LMHDISetup';
import LMHDOSetup from "@src/application/Components/lmh/LMHDOSetup";
import DIOSetupPage from "@src/application/Components/ioh/DIOSetupPage";
import LMHUserDefine from '../lmh/LMHUserDefine';

const { TabPane } = Tabs;
const UserButton = styled(Button)`
  margin-right: 10px;
`;
export default function LogicSetupContents(): ReactElement {
  return (
    <>
      <Tabs type="card">
        <TabPane tab="LMH" key="1">
          <LMHDISetup />
          <LMHDOSetup />
        </TabPane>
        <TabPane tab="IO" key="2">
          <UserButton> ALL </UserButton>
          <UserButton> Each </UserButton>
          <DIOSetupPage moduleId={1} diCount={10}/>
        </TabPane>
        <TabPane tab="LMH Geneal DIO" key="3">
          <LMHUserDefine/>
        </TabPane>
      </Tabs>
    </>
  );
}
