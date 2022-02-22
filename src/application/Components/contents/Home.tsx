import { Tabs } from 'antd';
import React, { ReactElement, useState } from 'react';
import UserInput from '../UserInput';
import UserSelect from '../UserSelect';
const { TabPane } = Tabs;
const elements = [{key : "1" , value : "1", name : "lolo"}, {key : "2" , value : "2", name : "2lolo"}];

export default function Home(): ReactElement {
  const [value, setValue] = useState(0);
  return (
    <div>
      <Tabs type="card">
        <TabPane tab="Input Box" key="1">
          <UserInput
            label="input"
            value={value}
            onChange={(v) => setValue(v)}
          />
          <div>{value}</div>
        </TabPane>
        <TabPane tab="Select Box" key="2">
          <UserSelect elements = {elements}/>
        </TabPane>
      </Tabs>
    </div>
  );
}
