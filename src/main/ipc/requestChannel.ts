import { IpcMainEvent } from 'electron';
import { REQ_DATA } from '@src/ipcChannels';
import { IpcChannel } from './IPCChannel';
import A2700Register from '../modbus.a2700m/A2700M.Register';
import ModbusService from '../ModbusService';
import RequestChannelProps from './RequestChannelProps';

class RequestChannel implements IpcChannel<RequestChannelProps> {
  private name: string;

  constructor() {
    this.name = REQ_DATA;
  }

  getChannelName(): string {
    return this.name;
  }

  handle(event: IpcMainEvent, request: RequestChannelProps): void {
    const reg = new A2700Register(ModbusService.GetClient());

    reg.Request(request.requestType).subscribe((e) => {
      event.sender.send(request.responseChannel, {
        data: e,
      });
    });

    console.log(`request channel ${this.name} ${event} ${request}`);
  }
}

export default RequestChannel;
