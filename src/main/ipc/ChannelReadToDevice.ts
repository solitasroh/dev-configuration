import WrappedElement from '@src/Data/WrappedElement';
import { REQ_READ_TO_DEVICE } from '@src/ipcChannels';
import { IpcMainEvent } from 'electron';
import { getFileInfo, util } from 'prettier';
import { async } from 'rxjs';
import ModbusService from '../ModbusService';
import { IpcChannel } from './IPCChannel';
import { IpcRequest } from './IPCRequest';

const addrAuthority = 40199;
const addrAuthorityCheck = 40200;
const addrAccessOperationCmd = 40201;
const addrFileInformation = 40202;

const addrOperationState = 40206;
const addrOperationError = 40207;
const addrFileContents = 40208;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface FileInformation {
  fileSize: number;

  fileCrc: number;

  fileType: number;
}

export class ChannelReadToDeviceProps implements IpcRequest {
  fileType: number;

  responseChannel?: string;
}

export class ChannelReadToDevice
  implements IpcChannel<ChannelReadToDeviceProps>
{
  private name: string;

  private buffer: number[];

  private elements: WrappedElement[]

  constructor() {
    this.name = REQ_READ_TO_DEVICE;
  }

  getChannelName(): string {
    return this.name;
  }

  async handle(
    event: IpcMainEvent,
    request: ChannelReadToDeviceProps,
  ): Promise<void> {
    const { fileType } = request;
    const service = ModbusService.GetClient();
    service.writeRegister(65534, 65535);
    const authority = await this.getAuthority();
    console.log('authority is ', authority);

    if (authority) {
      if (await this.setFileType(fileType)) {
        if (await this.setReadCommand()) {
          console.log('file type set : success');
          const info = await this.getFileInformation();
          console.log('command set : success  file size = ', info.fileSize);
          this.buffer = [];
          this.elements = [];
          console.log(this.buffer.length);
          if (await this.readFile(info.fileSize, 0)) {
            console.log("result success");
            
            const res = String.fromCharCode(...this.buffer).toString();
            
            console.log(res);
            const d = res.split('\r\n');
            console.log(d);
            let key = 0;
            const elements = d.map(str => {
                const s = str.split(' ');
                const e = new WrappedElement();
                
                e.wrappedAddress = parseInt(s[1], 10);
                e.length = parseInt(s[2], 10);
                e.page = parseInt(s[3], 10);
                e.address = parseInt(s[4], 10);
                e.key = key.toString();
                key+=1;
                return e;
            })
            this.elements  = elements;

            event.sender.send(request.responseChannel, {
                result: true,
                elements: this.elements,
              });
          }
        }
      }
      await this.returnAuthority();
    }
  }

  readFile = async (readSize: number, offset: number): Promise<boolean> => {
    const client = ModbusService.GetClient();
    
    if (client.isOpen) {
      let req = 120;
      if (readSize < 240) {
        req = readSize >> 1;
      }
      if (req !== 0) {
        const readResult = await client.readHoldingRegisters(
            addrFileContents,
            req,
          );
          
          for(let i = 0; i < readResult.buffer.length; i+=2) {
            const l = readResult.buffer.readUInt8(i);
            const h = readResult.buffer.readUInt8(i+1);
            this.buffer.push(h);
            this.buffer.push(l);
          }
      } 
    
      const offs = offset + (req<<1);
      const remaining = readSize - (req<<1);

      const status = await this.getOperationStatus();
      const error = await this.getErrorStatus();
      await sleep(100);
      if (status === 4 || readSize <= 0) {
        if (error === 0) {
          console.log('read success');
          return true;
        }
        if (error === 2) {
          console.log('read error ');
          return false;
        }
        if (error === 3) {
          console.log('timeout error');
          return false;
        }
      }
      
      console.log(`read size = ${req} remaining = ${remaining}`);
      const result = await this.readFile(remaining, offs);
      console.log("read result = ", result);
      return result;
    }

    return false;
  };

  getAuthority = async (): Promise<boolean> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
      let result = await client.readHoldingRegisters(addrAuthority, 1);

      const authorityAvaliable = result.data[0] === 0;
      console.log('authority avaliable = ', result.data[0]);
      if (authorityAvaliable) {
        await client.writeRegister(addrAuthority, 0x8000);

        result = await client.readHoldingRegisters(addrAuthorityCheck, 1);
        console.log('authority check = ', result.data[0]);
        return result.data[0] === 1;
      }
    }

    return false;
  };

  returnAuthority = async (): Promise<boolean> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
        await client.writeRegister(addrAuthority, 0xA5A5);
        return true;
    }

    return false;
  }

  getOperationStatus = async (): Promise<number> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
      const result = await client.readHoldingRegisters(addrOperationState, 1);

      return result.data[0];
    }
    return 0;
  };

  getErrorStatus = async (): Promise<number> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
      const result = await client.readHoldingRegisters(addrOperationError, 1);

      return result.data[0];
    }
    return 0;
  };

  getFileInformation = async (): Promise<FileInformation> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
      const result = await client.readHoldingRegisters(addrFileInformation, 4);
      const fileInfo: FileInformation = {
        fileCrc: 0,
        fileSize: 0,
        fileType: 0,
      };

      const [fileType, fileCrc, fileSizeL, fileSizeH] = result.data;

      console.log(
        result.data[0],
        result.data[1],
        result.data[2],
        result.data[3],
      );

      fileInfo.fileType = fileType;
      fileInfo.fileCrc = fileCrc;
      fileInfo.fileSize = fileSizeH | (fileSizeL << 16);

      console.log(
        `type = ${fileInfo.fileType}, crc = ${fileInfo.fileCrc}, size = ${fileInfo.fileSize}`,
      );

      return fileInfo;
    }

    return null;
  };

  setReadCommand = async (): Promise<boolean> => {
    const client = ModbusService.GetClient();
    const readCommand = 2;

    if (client.isOpen) {
      await client.writeRegister(addrAccessOperationCmd, readCommand);
      await sleep(100);

      const status = await this.getOperationStatus();
      console.log(`set command and read status = ${status}`);
      return status === 2;
    }

    return false;
  };

  setFileType = async (fileType: number): Promise<boolean> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
        console.log("set file type = ", fileType);
      await client.writeRegister(addrFileInformation, fileType);
      await sleep(100);

      return true;
    }

    return false;
  };
}
