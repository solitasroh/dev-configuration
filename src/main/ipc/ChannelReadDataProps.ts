import { IpcRequest } from './IPCRequest';

export default class ChannelReadDataProps implements IpcRequest {
  requestType?: string;

  responseChannel?: string;
}
