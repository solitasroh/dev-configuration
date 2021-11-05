import { IpcMainEvent } from 'electron';
import { IpcRequest } from './IPCRequest';

export interface IpcChannel<T extends IpcRequest> {
  getChannelName(): string;
  handle(event: IpcMainEvent, request: T): void;
}
