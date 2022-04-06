import { Card, List, Space, Drawer } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';

import IncomingUnitBox from './IncomingUnitBox';
import LocalUnitBox from '../lmh/LocalUnitBox';
import { usePolling } from '@src/application/hooks/ipcHook';
import { IncomingStatus } from '@src/main/modbus.a2700m/m/RegisterIncomingStatus';
import IpcService from '@src/main/IPCService';
import MotorUnitDOSetup from '@src/application/Components/pc/MotorUnitDOSetup';
import MotorUnitDISetup from '@src/application/Components/pc/MotorUnitDISetup';
import MotorUnitBox from '@src/application/Components/pc/MotorUnitBox';

const motorUnits = [
  { key: 1, id: 1 },
  { key: 2, id: 2 },
  { key: 3, id: 3 },
  { key: 4, id: 4 },
  { key: 5, id: 5 },
  { key: 6, id: 6 },
  { key: 7, id: 7 },
  { key: 8, id: 8 },
  { key: 9, id: 9 },
  { key: 10, id: 10 },
  { key: 11, id: 11 },
  { key: 12, id: 12 },
  { key: 13, id: 13 },
  { key: 14, id: 14 },
  { key: 15, id: 15 },
  { key: 16, id: 16 },
  { key: 17, id: 17 },
  { key: 18, id: 18 },
  { key: 19, id: 19 },
  { key: 20, id: 20 },
  { key: 21, id: 21 },
  { key: 22, id: 22 },
  { key: 23, id: 23 },
  { key: 24, id: 24 },
  { key: 25, id: 25 },
  { key: 26, id: 26 },
  { key: 27, id: 27 },
  { key: 28, id: 28 },
  { key: 29, id: 29 },
  { key: 30, id: 30 },
  { key: 31, id: 31 },
  { key: 32, id: 32 },
  { key: 33, id: 33 },
  { key: 34, id: 34 },
  { key: 35, id: 35 },
  { key: 36, id: 36 },
  { key: 37, id: 37 },
  { key: 38, id: 38 },
  { key: 39, id: 39 },
  { key: 40, id: 40 },
];

export default function Home(): ReactElement {
  const [open, setOpen] = useState(false);
  const [moduleID, SetModuleID] = useState(0);
  const [incomingStatus, setIncomingStatus] = useState<IncomingStatus>();
  const [pcList, setPCList] = useState<boolean[]>();

  usePolling(
    {
      responseChannel: 'POLL-LMH-information',
      requestType: 'IncomingStatus',
      props: { id: 0 },
    },
    (evt, rest) => {
      const infoList = rest as IncomingStatus;
      setIncomingStatus(infoList);
    },
    1000,
  );

  useEffect(() => {
    const service = IpcService.getInstance();
    const eventHandler = (evt: any, resp: any) => {
      const state = resp as boolean[];
      if (state !== undefined) {
        setPCList(state);
      }
    };

    service.on('PC_STATUS_CHAGNED', eventHandler);
    return () => {
      service.removeListner('PC_STATUS_CHAGNED', eventHandler);
    };
  }, []);

  const handleClick = (id: number) => {
    SetModuleID(id);
    setOpen((prev) => !prev);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <div>
        <Card
          title="INCOMING UNIT (Accura 2700M)"
          size="small"
          bordered={false}
        >
          <IncomingUnitBox incommingInfo={incomingStatus} />
        </Card>
        <Card
          title="MOTOR UNIT (Accura 2750P[C])"
          size="small"
          bordered={false}
        >
          <List
            dataSource={motorUnits}
            split
            pagination={{
              pageSize: 5,
            }}
            itemLayout="horizontal"
            renderItem={(item) => {
              if (pcList === null || pcList === undefined) {
                return <></>;
              }
              return (
                <Space>
                  {pcList[item.id - 1] === true ? (
                    <MotorUnitBox id={item.id} onClick={handleClick} />
                  ) : (
                    <></>
                  )}
                </Space>
              );
            }}
          />
        </Card>
        <Card title="LOCAL UNIT (Accura 2750LMH)" size="small" bordered={false}>
          <LocalUnitBox
            unitInfo={motorUnits.slice(0, 15)}
            mismatch={incomingStatus?.mismatchState}
          />
        </Card>
      </div>
      <Drawer
        title={`Motor Unit ${moduleID} Setup`}
        placement="right"
        onClose={onClose}
        visible={open}
      >
        <MotorUnitDISetup moduleId={moduleID} />
        <MotorUnitDOSetup moduleId={moduleID} />
      </Drawer>
    </div>
  );
}
