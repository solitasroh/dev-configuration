import { IpcMainEvent } from 'electron';
import { WRITE_REQ } from '@src/ipcChannels';

import { IpcChannel } from './IPCChannel';

import A2700Register from '../modbus.a2700m/A2700M.Register';
import ModbusService from '../ModbusService';
import { IpcRequest } from './IPCRequest';

import * as fs from 'fs';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ChannelSendToDeviceProps implements IpcRequest {
  requestType: string;

  filePath: string;

  responseChannel?: string;
}

export class ChannelSendToDevice implements IpcChannel<ChannelSendToDeviceProps> {
  private name: string;

  private register: A2700Register;

  constructor() {
    this.name = WRITE_REQ;
    this.register = new A2700Register();
  }

  getChannelName(): string {
    return this.name;
  }

  async handle(
    event: IpcMainEvent,
    request: ChannelSendToDeviceProps,
  ): Promise<void> {
    
    const { filePath } = request;
    const data = fs.readFileSync(filePath);
    const service = ModbusService.GetClient();

    try {
        service.writeRegister(65534, 65535);

        const state = await this.getWrappedRegisterWriteState();
    
        if (state === 0) {
          service.writeRegister(40200, 1);
        }
    
        const success = await this.retryReadState(0, 0);
    
        if (success)  {
            await this.retryWriteFileContents(data, 0, 120, data.byteLength);
            event.sender.send(request.responseChannel, true);
        } else {
            event.sender.send(request.responseChannel, false);
        }
    } catch (error) {
        console.log(error);
        event.sender.send(request.responseChannel, false);
    }
  }

  getWrappedRegisterWriteState = async (): Promise<number> => {
    const service = ModbusService.GetClient();
    const readRegisters = await service.readHoldingRegisters(40201, 1);
    return readRegisters.data[0];
  };

  retryReadState = async (state: number, count: number) : Promise<boolean> => {
    if (state === 1) {
        return true;
    } 

    const readState = await this.getWrappedRegisterWriteState();
    const c = count+1;
    
    if (c === 10) {
        return false;
    }
    
    await sleep(100);
    
    return this.retryReadState(readState, c);    
  };
  
  retryWriteFileContents = async (data: Buffer, offset:number, wlen: number, remainingLen: number) : Promise<boolean>=> {
    const service = ModbusService.GetClient();
    if (remainingLen <= 0) {
        return true;
    } 
    
    const endOffset = offset + (wlen * 2);
    const writeBuffer = data.slice(offset, endOffset);

    const remaining = remainingLen - (wlen * 2);
    const readLength = remaining < 120 ? remaining : wlen;

    service.writeRegisters(40202, writeBuffer);
    service.writeRegister(40329, wlen);

    return this.retryWriteFileContents(data, endOffset, readLength, remaining);
  }
}
