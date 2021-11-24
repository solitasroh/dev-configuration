import { IpcRequest } from './IPCRequest';

export default class DefaultRequestProps implements IpcRequest {
  responseChannel?: string;
}