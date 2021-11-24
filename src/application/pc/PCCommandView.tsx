import PCCommand from '@src/Data/PCCommand';
import { WRITE_REQ } from '@src/ipcChannels';
import ChannelWriteDataProps from '@src/main/ipc/ChannelWriteDataProps';
import IpcService from '@src/main/IPCService';
import { Input, Space, Card, Button, Switch } from 'antd'
import React, { ReactElement, useState } from 'react'


export default function PCCommandView(): ReactElement {
    const [id, setId] = useState(1);
    const onRunClicked = () => {
        const data = new PCCommand();
        data.command = 1;
        data.id = id;
        if (id <= 0) {
            return ;
        }
        const service = IpcService.getInstance();
        service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
            writeData: data,
            requestType: 'PCCommand',
        });
    }

    const onStopClicked = () => {
        const data = new PCCommand();
        data.command = 2;
        data.id = id;
        if (id <= 0) {
            return ;
        }
        const service = IpcService.getInstance();
        service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
            writeData: data,
            requestType: 'PCCommand',
        });
    }
    
    const onCtrlBlockClicked = (checked:boolean) => {
        const data = new PCCommand();
        data.command = checked ? 3 : 4;
        data.id = id;
        if (id <= 0) {
            return ;
        }
        const service = IpcService.getInstance();
        service.send<void, ChannelWriteDataProps>(WRITE_REQ, {
            writeData: data,
            requestType: 'PCCommand',
        });
    }
    return (
        <Card title="PC Control" size="small" type="inner">
            <Space>
                <p>ID </p>
                <Input value={id} onChange={(e)=> setId(parseInt(e.target.value, 10))}/>
                <Button onClick={onRunClicked}>RUN1</Button>
                <Button onClick={onStopClicked}>STOP</Button>
                <Switch
                    size="small"
                    onChange={onCtrlBlockClicked}
            />
            </Space>
        </Card>
    )
}
