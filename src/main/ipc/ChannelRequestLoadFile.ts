import { dialog, IpcMainEvent } from 'electron';
import * as fs from 'fs';
import * as readline from 'readline';
import { REQ_LOAD_FILE } from '../../ipcChannels';
import { IpcChannel } from './IPCChannel';
import { IpcRequest } from './IPCRequest';
import WrappedElement from '../../Data/WrappedElement';
import events from 'events';

export class WrappedFileLoadProps implements IpcRequest {
  responseChannel?: string;
}

export class ChannelRequestLoadFile
  implements IpcChannel<WrappedFileLoadProps>
{
  protected channelName: string;

  constructor() {
    this.channelName = REQ_LOAD_FILE;
  }

  getChannelName(): string {
    return this.channelName;
  }

  public handle = async (
    event: IpcMainEvent,
    request: WrappedFileLoadProps,
  ): Promise<void> => {
    const filePaths = dialog.showOpenDialogSync({
      title: 'load wrapped elements',
      properties: ['openFile'],
    });
    if (filePaths.length !== 1) {
      event.sender.send(request.responseChannel, { result: false });
      return;
    }
    try {
      const wrappedElements: WrappedElement[] = [];
      const file = `${filePaths[0]}`;

      const instream = fs.createReadStream(file);

      const reader = readline.createInterface({input: instream, crlfDelay: Infinity});

      reader.on('line', (line) => {
        const elementArr = line.split(' ');
        console.log(elementArr);
        if (elementArr.length !== 5) return;

        const wrappedAddress = Number.parseInt(elementArr[1], 10);
        const length = Number.parseInt(elementArr[2], 10);
        const page = Number.parseInt(elementArr[3], 10);
        const address = Number.parseInt(elementArr[4], 10);

        const element = new WrappedElement();
        element.wrappedAddress = wrappedAddress;
        element.length = length;
        element.page = page;
        element.address = address;

        wrappedElements.push(element);
        
        console.log(wrappedElements);
      });

      reader.on('close', () => {
        console.log('file read end');
        console.log(wrappedElements);
        event.sender.send(request.responseChannel, {
          result: true,
          elements: wrappedElements,
        });
      });

      await events.once(reader, 'close');
      
      instream.close();

      
    } catch (error) {
      console.log(error);
      event.sender.send(request.responseChannel, { result: false });
    }
  };
}
