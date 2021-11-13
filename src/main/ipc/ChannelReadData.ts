import { IpcMainEvent } from 'electron';
import { REQ_DATA } from '@src/ipcChannels';
import { IpcChannel } from './IPCChannel';
import A2700Register from '../modbus.a2700m/A2700M.Register';
import { IpcRequest } from './IPCRequest';

export type ReadData = Buffer;

export class ChannelReadDataProps implements IpcRequest {
  requestType?: string;

  responseChannel?: string;
}

export class ChannelReadData implements IpcChannel<ChannelReadDataProps> {
  private name: string;

  private register: A2700Register;

  constructor() {
    this.name = REQ_DATA;
    this.register = new A2700Register();
  }

  getChannelName(): string {
    return this.name;
  }

  handle(event: IpcMainEvent, request: ChannelReadDataProps): void {
    this.register.Get(request.requestType).subscribe((res) => {
      event.sender.send(request.responseChannel, res);
    });
  }
}
