/* eslint-disable no-undef */
import IOHInfoData from '@src/Data/IOHInfoData';
import { Tabs } from 'antd';
import React, { ReactElement, useState } from 'react';
import IOHUserDefineSetup from './IOHUserDefineSetup';
const { TabPane } = Tabs;

interface Props {
  moduleList: IOHInfoData[];
}
export default function IOHUserDefine({ moduleList }: Props): ReactElement {
  const [activeKey, setActiveKey] = useState('');
  // const changeHandle = (e: string) => {
  //   setActiveKey(e);
  // };

  // const getForceRenderResult = (index: number): boolean => {
  //   console.log(`index = ${index}, key=${activeKey}`)
  //   if (index.toString() === activeKey) {
  //     return true;
  //   }

  //   return false;
  // };

  return (
    <div>
      <Tabs tabPosition="left">
        {moduleList.map((data, index) => (
          <TabPane
            tab={`ID ${data.id}`}
            key={index.toString()}
          >
            <IOHUserDefineSetup moduleID={data.id} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}
