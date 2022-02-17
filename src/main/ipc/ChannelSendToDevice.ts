import { IpcMainEvent } from 'electron';
import { REQ_SEND_TO_DEVICE } from '@src/ipcChannels';

import WrappedElement from '@src/Data/WrappedElement';
import * as fs from 'fs';
import { IpcChannel } from './IPCChannel';

import A2700Register from '../modbus.a2700m/A2700M.Register';
import ModbusService from '../ModbusService';
import { IpcRequest } from './IPCRequest';
import { async } from 'rxjs';
import { calculateCRC } from '@src/Utils';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ChannelSendToDeviceProps implements IpcRequest {
  fileType: number;

  elements: WrappedElement[];

  responseChannel?: string;
}

export class ChannelSendToDevice
  implements IpcChannel<ChannelSendToDeviceProps>
{
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
    const { fileType, elements } = request;
    const elementToStr = elements.map(
      (e) =>
        `#ELEMENT ${e.wrappedAddress} ${e.length} ${e.page} ${e.address}\r\n`,
    );
    elementToStr.push('#END\r\n');
    const data = Buffer.from(elementToStr.join(''), 'utf-8');

    console.log(`len = ${data.length} bLen = ${data.byteLength}`);
    console.log(data);

    const service = ModbusService.GetClient();

    const type = fileType === 1 ? 2 : 1;
    console.log(data.byteOffset, data.length>>1);
    const buffer = new Uint16Array(data.buffer, data.byteOffset, data.length>>1);

    const result = Array.from(buffer);
    
    const crc = calculateCRC(data, data.length);
    
    try {
      service.writeRegister(65534, 65535);

      const authority = await this.getAuthority();
      const length = [ data.length >> 16, data.length & 0xFFFF];
      if (authority) {
        await service.writeRegister(40202, type);
        await service.writeRegister(40203, crc);
        await service.writeRegisters(40204, length);
        await service.writeRegister(40201, 1);

        const success = await this.retryReadState(0, 0);
        if (success) {
          const wLen = result.length < 120 ? result.length : 120;
          console.log(`remaining ${result.length} readLength ${wLen}`);

          await this.retryWriteFileContents(result, 0, wLen, result.length);

          event.sender.send(request.responseChannel, true);
        } else {
          console.log('read state failed');
          event.sender.send(request.responseChannel, false);
        }
      }
    } catch (error) {
      event.sender.send(request.responseChannel, false);
    }
  }

  getAuthority = async (): Promise<boolean> => {
    const service = ModbusService.GetClient();
    await service.writeRegister(40199, 0x8000);

    const result = await service.readHoldingRegisters(40200, 1);
    return result.data[0] === 1;
  };

  getWrappedRegisterWriteState = async (): Promise<number> => {
    const service = ModbusService.GetClient();
    const readRegisters = await service.readHoldingRegisters(40206, 1);
    return readRegisters.data[0];
  };

  retryReadState = async (state: number, count: number): Promise<boolean> => {
    if (state === 1) {
      return true;
    }

    const readState = await this.getWrappedRegisterWriteState();
    console.log(`read state = ${readState}`);
    const c = count + 1;

    if (c === 10) {
      return false;
    }

    await sleep(100);

    return this.retryReadState(readState, c);
  };

  retryWriteFileContents = async (
    data: number[],
    offset: number,
    wlen: number,
    remainingLen: number,
  ): Promise<boolean> => {
    const service = ModbusService.GetClient();
    if (remainingLen <= 0) {
      return true;
    }

    const endOffset = offset + wlen;

    const writeBuffer = data.slice(offset, endOffset);

    const remaining = remainingLen - wlen;
    const readLength = remaining < 120 ? remaining : wlen;

    console.log(`remaining ${remaining} readLength ${readLength}`);

    try {
      await service.writeRegisters(40208, writeBuffer);
      const resultOprationStatus = await service.readHoldingRegisters(40206, 1);
      const resultError = await service.readHoldingRegisters(40207, 1);
      console.log(`state = ${resultOprationStatus.data[0]} error= ${resultError.data[0]}`);
      if (resultOprationStatus.data[0] === 4) {
        if (resultError.data[0] === 1) console.log(`Write error`);
        else if (resultError.data[0] === 3) console.log(`timeout error`);
        else if (resultError.data[0] === 4) console.log(`CRC error`);
        else console.log("no error");
      }
      return await this.retryWriteFileContents(
        data,
        endOffset,
        readLength,
        remaining,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
