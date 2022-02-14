import { dialog, IpcMainEvent } from 'electron';
import * as fs from 'fs';
import { REQ_CREATE_FILE } from '../../ipcChannels';
import { IpcChannel } from './IPCChannel';
import { IpcRequest } from './IPCRequest';
import WrappedElement from '../../Data/WrappedElement';

export class WrappedFileCreateProps implements IpcRequest {
  elements: WrappedElement[];
  
  fileType : number;
  
  responseChannel?: string;
}

export class ChannelRequestCreateFile
  implements IpcChannel<WrappedFileCreateProps>
{
  protected channelName: string;

  constructor() {
    this.channelName = REQ_CREATE_FILE;
  }

  getChannelName(): string {
    return this.channelName;
  }

  public handle = async (
    event: IpcMainEvent,
    request: WrappedFileCreateProps,
  ): Promise<void> => {
    const { elements } = request;

    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'save wrapped elements',
    });
    
    if (!canceled) {
      try {
        const file = `${filePath}`;
        
        this.fileSave(file, elements);
        
        // const fd = await fs.openSync(file, 'w+');

        // elements.map((e) => {
        //   const elementText = `#ELEMENT ${e.wrappedAddress} ${e.length} ${e.page} ${e.address} ${e.desc}\r\n`;
        //   fs.writeFileSync(fd, elementText, { encoding: 'utf8' });
        //   return undefined;
        // });

        // await fs.writeFileSync(fd, '#END\r\n');

        // fs.close(fd, () => {
        //   console.log('wrapped register file closed');
        // });
        event.sender.send(request.responseChannel, {
            result: true,
            path : file
        });
      } catch (error) {
          console.log(error);
          event.sender.send(request.responseChannel, {
              result : false
          });    
      }
    } else {
      event.sender.send(request.responseChannel, {
          result: false
      });
    }
  };

  fileSave = (filePath:string, elements: WrappedElement[]) => {
    const data = JSON.stringify(elements);
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) { 
        console.log("error writing file:", err);
      } else {
        console.log("file is written successfully!");
      }
    });
} 
}
