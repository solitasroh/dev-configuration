import { IpcMainEvent } from 'electron';
import { CONNECTION } from '../../ipcChannels';
import ModbusService from '../ModbusService';
import { IpcChannel } from './IPCChannel';
import { IpcRequest } from './IPCRequest';

export class ConnectionProps implements IpcRequest {
  ip: string;

  port: number;

  responseChannel: string;
}

export class ConnectChannel implements IpcChannel<ConnectionProps> {
  protected channelName: string;

  constructor() {
    this.channelName = CONNECTION;
  }

  getChannelName(): string {
    return this.channelName;
  }

  public handle = async (
    event: IpcMainEvent,
    request: ConnectionProps,
  ): Promise<void> => {
    const { ip, port } = request;

    const client = ModbusService.GetClient();

    try {
      await client.connectTCP(ip, { port });
    } catch (error) {
      event.sender.send(request.responseChannel, false);
    }

    event.sender.send(request.responseChannel, true);
  };
}
