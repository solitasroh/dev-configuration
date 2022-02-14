import React, { ReactElement } from 'react';

import { Space } from 'antd';

export default function DIPolaritySetup(): ReactElement {
    function selectChanged(value: any) {
        console.log(`selected ${value}`);
      }
  return (
    <Space>
      <select value="0" onChange={selectChanged}>
        <option value="0">None</option>
        <option value="1">Normal</option>
        <option value="2">Reverse</option>
      </select>
    </Space>
  );
}