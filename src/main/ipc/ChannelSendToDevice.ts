import { IpcMainEvent } from 'electron';
import { REQ_SEND_TO_DEVICE } from '@src/ipcChannels';

import { IpcChannel } from './IPCChannel';

import A2700Register from '../modbus.a2700m/A2700M.Register';
import ModbusService from '../ModbusService';
import { IpcRequest } from './IPCRequest';

import * as fs from 'fs';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ChannelSendToDeviceProps implements IpcRequest {
  filePath: string;
  
  fileType: number;
  
  responseChannel?: string;
}

export class ChannelSendToDevice implements IpcChannel<ChannelSendToDeviceProps> {
  private name: string;

  private register: A2700Register;

  constructor() {
    this.name = REQ_SEND_TO_DEVICE;
    this.register = new A2700Register();
  }

  getChannelName(): string {
    return this.name;
  }

  async handle(
    event: IpcMainEvent,
    request: ChannelSendToDeviceProps,
  ): Promise<void> {
    
    const { filePath, fileType } = request;
    
    const data = fs.readFileSync(filePath);
    
    const service = ModbusService.GetClient();
    
    const type = fileType === 1 ? 1 : 0;

    const buffer = new Uint16Array(data.buffer, data.byteOffset, data.length)
    const result = Array.from(buffer);
    console.log(`bLen = ${buffer.byteLength} u16Len = ${result.length}`);
    try {
        service.writeRegister(65534, 65535);

        const state = await this.getWrappedRegisterWriteState();
    
        if (state === 0) {
          service.writeRegister(40200, type);
        }
    
        const success = await this.retryReadState(0, 0);
        if (success)  {
            const wLen = result.length < 120 ? result.length : 120;
            console.log(`remaining ${result.length} readLength ${wLen}`);
            await this.retryWriteFileContents(result, 0, wLen, result.length);
            event.sender.send(request.responseChannel, true);
        } else {
            event.sender.send(request.responseChannel, false);
        }
    } catch (error) {
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
  
  retryWriteFileContents = async (data: number[], offset:number, wlen: number, remainingLen: number) : Promise<boolean>=> {
    const service = ModbusService.GetClient();
    if (remainingLen <= 0) {
        return true;
    } 
    
    const endOffset = offset + (wlen);

    const writeBuffer = data.slice(offset, endOffset);

    const remaining = remainingLen - (wlen);
    const readLength = remaining < 120 ? remaining : wlen;
    
    console.log(`remaining ${remaining} readLength ${readLength}`);

    try
    {
      await service.writeRegisters(40202, writeBuffer);
      await service.writeRegister(40329, wlen);
      
      if (remaining <= 0) {
        return true;
      }
      return await this.retryWriteFileContents(data, endOffset, readLength, remaining);
    }
    catch (error)
    {
      console.log(error);
      throw error;
    }
  }
}
