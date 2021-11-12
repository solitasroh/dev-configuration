import { IpcMainEvent } from 'electron';
import { WRITE_REQ } from '@src/ipcChannels';
import { IpcChannel } from './IPCChannel';
import A2700Register from '../modbus.a2700m/A2700M.Register';
import RequestChannelProps from './RequestChannelProps';

class WriteRequestChannel implements IpcChannel<RequestChannelProps> {
  private name: string;

  private register: A2700Register;

  constructor() {
    this.name = WRITE_REQ;
    this.register = new A2700Register();
  }

  getChannelName(): string {
    return this.name;
  }

  handle(event: IpcMainEvent, request: RequestChannelProps): void {
    this.register.Set(request.requestType, request.requestData);
  }
}

export default WriteRequestChannel;
