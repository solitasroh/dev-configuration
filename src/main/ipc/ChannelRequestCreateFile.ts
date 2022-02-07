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
    console.log("send handle");
    const { elements, fileType } = request;

    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'save wrapped elements',
    });
    // let fileName = 'wrapped_register_file'
    
    // if (fileType === 0) {
    //     fileName = 'wrapped_register_file'
    // } else {
    //     fileName = 'wrapped_coil_file'
    // }

    if (!canceled) {
      try {
        const file = `${filePath}`;

        const fd = await fs.openSync(file, 'w+');

        elements.map((e) => {
          const elementText = `#ELEMENT ${e.wrappedAddress} ${e.length} ${e.page} ${e.address}\r\n`;
          fs.writeFileSync(fd, elementText, { encoding: 'utf8' });
          return undefined;
        });

        await fs.writeFileSync(fd, '#END\r\n');

        fs.close(fd, () => {
          console.log('wrapped register file closed');
        });
        event.sender.send(request.responseChannel, true);
      } catch (error) {
          console.log(error);
          event.sender.send(request.responseChannel, false);    
      }
    } else {
      event.sender.send(request.responseChannel, false);
    }
  };
}
