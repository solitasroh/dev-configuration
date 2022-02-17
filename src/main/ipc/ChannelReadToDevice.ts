import WrappedElement from '@src/Data/WrappedElement';
import { REQ_READ_TO_DEVICE } from '@src/ipcChannels';
import { IpcMainEvent } from 'electron';
import ModbusService from '../ModbusService';
import { IpcChannel } from './IPCChannel';
import { IpcRequest } from './IPCRequest';

const FileAccessAddress = {
  AddrAuthority: 40199,
  addrAuthorityCheck: 40200,
  addrAccessOperationCmd: 40201,
  addrFileInformation: 40202,
  addrOperationState: 40206,
  addrOperationError: 40207,
  addrFileContents: 40208,
} as const;

const FileAccessStatus = {
  Idle: 0,
  Wrinting: 1,
  Fetching: 2,
  Fetched: 3,
  Completed: 4,
} as const;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const FileAccessError = {
  NoError: 0,
  WriteError: 1,
  ReadError: 2,
  TimeoutError: 3,
  CrcError: 4,
};

interface FileInformation {
  fileSize: number;

  fileCrc: number;

  fileType: number;
}

export class ChannelReadToDeviceProps implements IpcRequest {
  fileType: number;

  responseChannel?: string;
}

export class ChannelReadToDeviceResult {
  result: boolean;

  error: string;

  elements: WrappedElement[];

  constructor(result: boolean, error?: string, elements?: WrappedElement[]) {
    this.result = result;
    this.error = error;
    this.elements = elements;
  }
}
export class ChannelReadToDevice
  implements IpcChannel<ChannelReadToDeviceProps>
{
  private name: string;

  private buffer: number[];

  private elements: WrappedElement[];

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
    const service = ModbusService.GetClient();
    service.writeRegister(65534, 65535);
    const authority = await this.getAuthority();

    if (authority) {
      if (await this.setFileType(request.fileType)) {
        if (await this.setReadCommand()) {
          const info = await this.getFileInformation();

          this.buffer = [];
          this.elements = [];
          const result = await this.readFile(info.fileSize, 0);
          if (result.result) {
            const lines = String.fromCharCode(...this.buffer).toString();
            lines.split('\r\n').forEach((str, index, arr) => {
              const line = str.split(' ');
              if (line[0] === '#ELEMENT') {
                const element = new WrappedElement();
                element.wrappedAddress = parseInt(line[1], 10);
                element.length = parseInt(line[2], 10);
                element.page = parseInt(line[3], 10);
                element.address = parseInt(line[4], 10);
                element.key = index.toString();
                this.elements.push(element);
              }
            });

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

  readFile = async (
    readSize: number,
    offset: number,
  ): Promise<ChannelReadToDeviceResult> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
      let req = 120;
      if (readSize < 240) {
        req = readSize >> 1;
      }
      if (req !== 0) {
        const readResult = await client.readHoldingRegisters(
          FileAccessAddress.addrFileContents,
          req,
        );

        for (let i = 0; i < readResult.buffer.length; i += 2) {
          const l = readResult.buffer.readUInt8(i);
          const h = readResult.buffer.readUInt8(i + 1);
          this.buffer.push(h);
          this.buffer.push(l);
        }
      }

      const offs = offset + (req << 1);
      const remaining = readSize - (req << 1);

      const status = await this.getOperationStatus();
      const error = await this.getErrorStatus();
      await sleep(100);
      if (status === FileAccessStatus.Completed || readSize <= 0) {
        if (error === FileAccessError.NoError) {
          return new ChannelReadToDeviceResult(true, null, this.elements);
        }
        if (error === FileAccessError.ReadError) {
          return new ChannelReadToDeviceResult(false, 'read failed');
        }
        if (error === FileAccessError.TimeoutError) {
          return new ChannelReadToDeviceResult(false, 'read failed: timeout');
        }
      }
      const result = await this.readFile(remaining, offs);
      return result;
    }

    return new ChannelReadToDeviceResult(false, 'No Connection');
  };

  getAuthority = async (): Promise<boolean> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
      let result = await client.readHoldingRegisters(
        FileAccessAddress.AddrAuthority,
        1,
      );

      const authorityAvaliable = result.data[0] === 0;
      if (authorityAvaliable) {
        await client.writeRegister(FileAccessAddress.AddrAuthority, 0x8000);

        result = await client.readHoldingRegisters(
          FileAccessAddress.addrAuthorityCheck,
          1,
        );
        return result.data[0] === 1;
      }
    }

    return false;
  };

  returnAuthority = async (): Promise<boolean> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
      await client.writeRegister(FileAccessAddress.AddrAuthority, 0xa5a5);
      return true;
    }

    return false;
  };

  getOperationStatus = async (): Promise<number> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
      const result = await client.readHoldingRegisters(
        FileAccessAddress.addrOperationState,
        1,
      );

      return result.data[0];
    }
    return 0;
  };

  getErrorStatus = async (): Promise<number> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
      const result = await client.readHoldingRegisters(
        FileAccessAddress.addrOperationError,
        1,
      );

      return result.data[0];
    }
    return 0;
  };

  getFileInformation = async (): Promise<FileInformation> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
      const result = await client.readHoldingRegisters(
        FileAccessAddress.addrFileInformation,
        4,
      );
      const fileInfo: FileInformation = {
        fileCrc: 0,
        fileSize: 0,
        fileType: 0,
      };

      const [fileType, fileCrc, fileSizeL, fileSizeH] = result.data;

      fileInfo.fileType = fileType;
      fileInfo.fileCrc = fileCrc;
      fileInfo.fileSize = fileSizeH | (fileSizeL << 16);

      return fileInfo;
    }

    return null;
  };

  setReadCommand = async (): Promise<boolean> => {
    const client = ModbusService.GetClient();
    const readCommand = 2;

    if (client.isOpen) {
      await client.writeRegister(
        FileAccessAddress.addrAccessOperationCmd,
        readCommand,
      );
      await sleep(100);

      const status = await this.getOperationStatus();
      return status === FileAccessStatus.Fetching;
    }

    return false;
  };

  setFileType = async (fileType: number): Promise<boolean> => {
    const client = ModbusService.GetClient();

    if (client.isOpen) {
      await client.writeRegister(
        FileAccessAddress.addrFileInformation,
        fileType,
      );

      await sleep(100);
      return true;
    }

    return false;
  };
}
