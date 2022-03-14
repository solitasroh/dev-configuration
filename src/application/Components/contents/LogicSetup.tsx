import { Tabs } from 'antd';
import React, { ReactElement, useState } from 'react';
import DIOSetupPage from '@src/application/Components/ioh/DIOSetupPage';
import LMHDIOSetupPage from '@src/application/Components/lmh/LMHDIOSetupPage';
import IOHInfoData from '@src/Data/IOHInfoData';
import { usePolling } from '@src/application/hooks/ipcHook';
import styled from 'styled-components';
import LMHUserDefine from '../lmh/LMHUserDefine';
import ModuleTypeSetup from '../lmh/ModuleTypeSetup';
import AI2SetupPage from '../ioh/AI2SetupPage';
import IOHUserDefine from '../ioh/IOHUserDefine';

const { TabPane } = Tabs;

const UserTab = styled(Tabs)`
  //.ant-tabs-content {
  //  height: 100%;
  //}
`;

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
      <UserTab type="card" className="MainTab">
        <TabPane tab="Module Type Setup for Logic" key="1">
          <ModuleTypeSetup />
        </TabPane>
        <TabPane tab="Logic IO" key="2">
          <LMHDIOSetupPage />
          {moduleType.map((data) =>
            data.moduleType === 'DIO' ? (
              <DIOSetupPage moduleId={data.id} />
            ) : (
              <AI2SetupPage moduleId={data.id} />
            ),
          )}
        </TabPane>
        <TabPane tab="LMH General DIO" key="3">
          <LMHUserDefine />
        </TabPane>
        <TabPane tab="IOH General DIO" key="4">
          <IOHUserDefine moduleList={moduleType} />
        </TabPane>
      </UserTab>
    </>
  );
}
