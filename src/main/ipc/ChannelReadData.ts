import { IpcMainEvent } from 'electron';
import { REQ_DATA } from '@src/ipcChannels';
import { IpcChannel } from './IPCChannel';
import A2700Register from '../modbus.a2700m/A2700M.Register';
import ChannelReadDataProps from './ChannelReadDataProps';

export type ReadData = Buffer;

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
    console.log(`REQUEST  : ${request.requestType}`);
    this.register.Get(request.requestType, request.props).subscribe(
      (res) => {
        console.log(`RESPONSE : ${request.requestType}`);
        event.sender.send(request.responseChannel, res);
      },
      () => {},
      () => {},
    );
  }
}
