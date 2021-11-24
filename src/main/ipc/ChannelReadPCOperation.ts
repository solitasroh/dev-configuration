import { IpcMainEvent } from 'electron';
import { REQ_PC_STATUS } from '@src/ipcChannels';
import { IpcChannel } from './IPCChannel';
import DefaultRequestProps from './DefaultRequestProps';
import MotorUnitManagement from '../modbus.a2700m/MotorUnitManagement';

export type ReadData = Buffer;

export class ChannelReadPCOperation implements IpcChannel<DefaultRequestProps> {
  private name: string;

  private MotorUnitManagement : MotorUnitManagement;

  constructor() {
    this.name = REQ_PC_STATUS;
    this.MotorUnitManagement = MotorUnitManagement.getInstance();
  }

  getChannelName(): string {
    return this.name;
  }

  handle(event: IpcMainEvent, request: DefaultRequestProps): void {
    const status = this.MotorUnitManagement.getStatus();
    event.sender.send(request.responseChannel, status);
  }
}
