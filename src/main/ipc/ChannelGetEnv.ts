import { GET_ENV } from '@src/ipcChannels';
import { IpcMainEvent } from 'electron';
import ModbusService from '@src/main/ModbusService';
import { IpcChannel } from './IPCChannel';
import { IpcRequest } from './IPCRequest';

export class GetEnvProps implements IpcRequest {
  responseChannel?: string;
}

export class ChannelGetEnv implements IpcChannel<GetEnvProps> {
  private name: string;

  constructor() {
    this.name = GET_ENV;
  }

  getChannelName(): string {
    return this.name;
  }

  handle(event: IpcMainEvent, request: GetEnvProps): void {
    console.log('get env handle');
    event.sender.send(request.responseChannel, {
      ipAddress: ModbusService.getIpAddress(),
    });
  }
}
