import { IpcMainEvent } from 'electron';
import ElectronStore from 'electron-store';
import { DISCONNECT } from '../../ipcChannels';
import ModbusService from '../ModbusService';
import { ConnectionProps } from './ChannelConnectServer';
import { IpcChannel } from './IPCChannel';

export default class ChannelDisconnectServer
  implements IpcChannel<ConnectionProps>
{
  protected channelName: string;

  store: ElectronStore;

  constructor() {
    this.channelName = DISCONNECT;
  }

  getChannelName(): string {
    return this.channelName;
  }

  public handle = async (
    event: IpcMainEvent,
    request: ConnectionProps,
  ): Promise<void> => {
    const instance = ModbusService.getInstance();

    if (instance.isConnected()) {
      instance.disconnect();
      event.sender.send(request.responseChannel, true);
    } else {
      event.sender.send(request.responseChannel, false);
    }
  };
}
