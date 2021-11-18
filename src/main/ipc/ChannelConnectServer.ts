import { IpcMainEvent } from 'electron';
import { CONNECTION } from '../../ipcChannels';
import ModbusService from '../ModbusService';
import { IpcChannel } from './IPCChannel';
import { IpcRequest } from './IPCRequest';

export class ConnectionProps implements IpcRequest {
  ip?: string;

  port?: number;

  connect?: boolean;

  responseChannel?: string;

  requestConnectState?: boolean;
}

export class ChannelConnectServer implements IpcChannel<ConnectionProps> {
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
    const { ip, port, connect, requestConnectState } = request;

    const client = ModbusService.GetClient();

    if (requestConnectState) {
      event.sender.send(request.responseChannel, client.isOpen);
      return;
    }

    if (connect) {
      try {
        if (client.isOpen) {
          client.close(() => {
            console.log('server already connected');
          });
        }
        client.setTimeout(10000);
        await client.connectTCP(ip, { port });
      } catch (error) {
        event.sender.send(request.responseChannel, false);
      }

      event.sender.send(request.responseChannel, true);
    } else {
      console.log('enter closing');

      await client.close(() => {
        console.log('closed');
      });
      event.sender.send(request.responseChannel, true);
    }
  };
}
