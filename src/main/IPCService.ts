import { IpcRenderer, IpcRendererEvent } from 'electron';
import { IpcRequest } from './ipc/IPCRequest';

type IpcEventCallback<T> = (event: IpcRendererEvent, ...args: T[]) => void;

class IpcService {
  private static instance: IpcService;

  static getInstance(): IpcService {
    if (this.instance == null) {
      this.instance = new IpcService();
    }
    return this.instance;
  }

  private ipcRenderer?: IpcRenderer;

  public send<T, R extends IpcRequest>(
    channel: string,
    request: R,
  ): Promise<T> {
    if (!this.ipcRenderer) {
      this.initIpcRenderer();
    }

    if (!request.responseChannel) {
      request.responseChannel = `${channel}_response_${new Date().getTime()}`;
    }
    this.ipcRenderer.send(channel, request);
    return new Promise((resolve) => {
      // response channel 대한 이벤트를 1회 등록
      this.ipcRenderer.once(request.responseChannel, (event, response) =>
        resolve(response),
      );
    });
  }

  public on<T>(channel: string, eventhandler: IpcEventCallback<T>): void {
    this.ipcRenderer.on(channel, eventhandler);
  }

  private initIpcRenderer() {
    if (!window || !window.process || !window.require) {
      throw new Error('Unable to require renderer process');
    }

    this.ipcRenderer = window.require('electron').ipcRenderer;
  }
}

export default IpcService;
