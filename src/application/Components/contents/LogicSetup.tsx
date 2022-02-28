import {Tabs } from 'antd';
import React, { ReactElement } from 'react';
import DIOSetupPage from '@src/application/Components/ioh/DIOSetupPage';
import LMHDIOSetupPage from '@src/application/Components/lmh/LMHDIOSetupPage';
import LMHUserDefine from '../lmh/LMHUserDefine';
import ModuleTypeSetup from '../lmh/ModuleTypeSetup';

const { TabPane } = Tabs;
export default function LogicSetupContents(): ReactElement {
  return (
    <>
      <Tabs type="card">
        <TabPane tab="Module Type Setup for Logic" key="1">
          <ModuleTypeSetup />
        </TabPane>
        <TabPane tab="Logic IO" key="2">
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            <LMHDIOSetupPage />
            <DIOSetupPage moduleId={1} />
            <DIOSetupPage moduleId={2} />
          </div>
        </TabPane>
        <TabPane tab="LMH Geneal DIO" key="3">
          <LMHUserDefine />
        </TabPane>
      </Tabs>
    </>
  );
}
