import { dialog, IpcMainEvent } from 'electron';
import * as fs from 'fs';
import * as readline from 'readline';
import events from 'events';
import { REQ_LOAD_FILE } from '../../ipcChannels';
import { IpcChannel } from './IPCChannel';
import { IpcRequest } from './IPCRequest';
import WrappedElement from '../../Data/WrappedElement';

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
//      const wrappedElements: WrappedElement[] = [];
      const file = `${filePaths[0]}`;
      const result = await this.loadFile(file);
      
      event.sender.send(request.responseChannel, {
        result: true,
        elements: result,
        filePath: file
      });
      
      // const instream = fs.createReadStream(file);

      // const reader = readline.createInterface({input: instream, crlfDelay: Infinity});
      // let count = 0;
      // reader.on('line', (line) => {
      //   const elementArr = line.split(' ');
      //   if (elementArr.length < 5) return;
      //   count += 1;
      //   const wrappedAddress = Number.parseInt(elementArr[1], 10);
      //   const length = Number.parseInt(elementArr[2], 10);
      //   const page = Number.parseInt(elementArr[3], 10);
      //   const address = Number.parseInt(elementArr[4], 10);
        
      //   const element = new WrappedElement();
      //   element.wrappedAddress = wrappedAddress;
      //   element.length = length;
      //   element.page = page;
      //   element.address = address;
        
      //   if (elementArr.length === 6) {
      //     const desc = elementArr[5];
      //     element.desc = desc;
      //   }
          
      //   element.key = count.toString();

      //   wrappedElements.push(element);
      // });

      // reader.on('close', () => {
      //   console.log('file read end');
      //   event.sender.send(request.responseChannel, {
      //     result: true,
      //     elements: wrappedElements,
      //     filePath: file
      //   });
      // });

      // await events.once(reader, 'close');
      
      // instream.close();

      
    } catch (error) {
      console.log(error);
      event.sender.send(request.responseChannel, { result: false });
    }
  };

  loadFile = (filePath: string): WrappedElement[] => {
    try{
      const data = fs.readFileSync(filePath, 'utf8');
      const read = JSON.parse(data) as WrappedElement[];
      return read;
    }catch(err) {
      console.log("error reading file from disk: ", err);
    }
   
    return null
  }
}
