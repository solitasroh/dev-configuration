import React, { ReactElement, useEffect, useState } from 'react';
import { Collapse, Empty, Pagination, Space } from 'antd';
import PCStatus from '@src/Data/PCStatus';
import IpcService from '@src/main/IPCService';
import {
  DefaultView,
  DIStatusView,
  DOStatusView,
  ProtectionView,
} from '../pc/PCStatus';
import PCControl from '../pc/PCControl';
import { usePolling } from '../../hooks/ipcHook';

const { Panel } = Collapse;

export default function PCContents(): ReactElement {
  const [init, setInit] = useState(0);
  const [index, setIndex] = useState(1);
  const [id, setId] = useState(1);
  const [state, setState] = useState<boolean[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statusList, setStatusList] = useState<PCStatus[]>([]);
  
  usePolling(
    {
      requestType: 'A2750PCStatus',
      responseChannel: 'POLL-PC-STATUS',
      props: {
        id: index,
      },
    },
    (evt, resp) => {
      const data = resp as PCStatus[];
      setStatusList(data);
    },
    500,
  );

  useEffect(() => {
    const service = IpcService.getInstance();
    

    service.on('PC_STATUS_CHAGNED', (evt, rest) => {
      const buffer = rest as boolean[];
      const { length } = buffer.filter((v) => v);      
      setState(buffer);
      setTotalCount(length);
      if(init === 0)
      {
        let idx = buffer.findIndex((res) => res === true);
        if(idx !== -1)
        {               
          setIndex(idx);
          idx +=1 
          setId(idx);
        }
       setInit(1111);
      }
      return () => {
        setState([]);
        setTotalCount(0);
        setStatusList([]);
        setId(1);
        setIndex(1);
      };
    });
  }, []);



  const onChange = (page: number, pageSize: number) => {
    // ��û�ϴ� ID�� �޶����� �ȴ�.
    let validIdx = 0;
    const idxArray: number[] = [];
          
    state.map((op, idx) => {
      if (op) {
        idxArray.push(idx);
        validIdx += 1;
        if (validIdx === page) {
          const pcId = idxArray[validIdx - 1] + 1;
          setId(pcId);       
          setIndex(idxArray[validIdx - 1]);
        }
      }
    });
  };

  return (
    <Space direction="vertical">
      <Pagination
        defaultCurrent={index}
        total={totalCount}
        size="small"
        defaultPageSize={1}
        showQuickJumper
        onChange={onChange}
      />
      <Space align="start" direction="horizontal">
        <Collapse defaultActiveKey={['1']} bordered={false} ghost>
          <Panel header="Status" key="1">
            {statusList.length === 0 ? (
              <Empty />
            ) : (
              <Space align="start">
                <DefaultView id={id} status={statusList[index]} />
                <DIStatusView id={id} status={statusList[index]} />
                <DOStatusView id={id} status={statusList[index]} />
                <ProtectionView id={id} status={statusList[index]} />
              </Space>
            )}
          </Panel>
        </Collapse>
        <Collapse defaultActiveKey={['1']} bordered={false} ghost>
          <Panel header="IO Control" key="1">
            <Space align="start">
              <PCControl id={id} />
            </Space>
          </Panel>
        </Collapse>
      </Space>
    </Space>
  );
}
