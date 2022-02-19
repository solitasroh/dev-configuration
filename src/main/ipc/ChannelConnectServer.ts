import { IpcMainEvent } from 'electron';
import ElectronStore from 'electron-store';
import { CONNECTION } from '../../ipcChannels';
import ModbusService from '../ModbusService';
import { IpcChannel } from './IPCChannel';
import { IpcRequest } from './IPCRequest';

export class ConnectionProps implements IpcRequest {
  ip?: string;

  port?: number;

  responseChannel?: string;
}

export class ChannelConnectServer implements IpcChannel<ConnectionProps> {
  protected channelName: string;

  store: ElectronStore;

  constructor() {
    this.channelName = CONNECTION;
    this.store = new ElectronStore();

    const ipAddr = this.store.get('ipAddress') as string;
    if (ipAddr !== undefined) {
      console.log(`saved ip address ${ipAddr}`);

      const client = ModbusService.getInstance();
      client.connect(ipAddr, 502);
    }
  }

  getChannelName(): string {
    return this.channelName;
  }

  public handle = async (
    event: IpcMainEvent,
    request: ConnectionProps,
  ): Promise<void> => {
    const { ip, port } = request;

    const instance = ModbusService.getInstance();
    // if (instance.isConnected()) {
    //   console.log('conn req> disconnected');
    //   instance.disconnect();
    // }
    // console.log('connect request');
    const connected = await instance.connect(ip, port);
    // console.log('connect result is', connected);
    event.sender.send(request.responseChannel, connected);
  };
}
