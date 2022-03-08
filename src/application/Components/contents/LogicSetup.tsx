import {Tabs } from 'antd';
import React, { ReactElement, useState } from 'react';
import DIOSetupPage from '@src/application/Components/ioh/DIOSetupPage';
import LMHDIOSetupPage from '@src/application/Components/lmh/LMHDIOSetupPage';
import IOHInfoData from '@src/Data/IOHInfoData';
import { usePolling } from '@src/application/hooks/ipcHook';
import LMHUserDefine from '../lmh/LMHUserDefine';
import ModuleTypeSetup from '../lmh/ModuleTypeSetup';
import AI2SetupPage from '../ioh/AI2SetupPage';
import IOHUserDefine from '../ioh/IOHUserDefine';

const { TabPane } = Tabs;
export default function LogicSetupContents(): ReactElement {
  
  const [moduleType, setModuleType] = useState<IOHInfoData[]>([]);
  usePolling(
    {
      responseChannel: 'POLL-IO-information',
      requestType: 'A2750IOInformation',
      props: { id: 0 },
    },
    (evt, rest) => {
      const infoList = rest as IOHInfoData[];
      const validIO = infoList.filter(
        (data) => data.operationStatus === 'OPERATING',
      );
      setModuleType(validIO);
    },
    1000,
  );
  return (
    <>
      <Tabs type="card">
        <TabPane tab="Module Type Setup for Logic" key="1">
          <ModuleTypeSetup />
        </TabPane>
        <TabPane tab="Logic IO" key="2">
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            <LMHDIOSetupPage />
            {moduleType.map((data) => data.moduleType === 'DIO' ? <DIOSetupPage moduleId={data.id}/> : <AI2SetupPage moduleId={data.id}/>)}
          </div>
        </TabPane>
        <TabPane tab="LMH Geneal DIO" key="3">
          <LMHUserDefine />
        </TabPane>        
        <TabPane tab="IOH Geneal DIO" key="4">
          <IOHUserDefine moduleList = {moduleType} />
        </TabPane>
      </Tabs>
    </>
  );
}
