import { GET_ENV, REQ_SEND_TO_DEVICE } from '@src/ipcChannels';
import { IpcMainEvent } from 'electron';
import ElectronStore from 'electron-store';
import { IpcChannel } from './IPCChannel';
import { IpcRequest } from './IPCRequest';

export class GetEnvProps implements IpcRequest {
  responseChannel?: string;
}

export class ChannelGetEnv implements IpcChannel<GetEnvProps> {
  private name: string;

  private ipAddress: string;

  constructor() {
    this.name = GET_ENV;
    const store = new ElectronStore();
    const ipAddr = store.get('ipAddress') as string;
    if (ipAddr !== undefined) {
      this.ipAddress = ipAddr;
    }
  }

  getChannelName(): string {
    return this.name;
  }

  handle(event: IpcMainEvent, request: GetEnvProps): void {
    console.log('get env handle');
    event.sender.send(request.responseChannel, {
      ipAddress: this.ipAddress,
    });
  }
}
