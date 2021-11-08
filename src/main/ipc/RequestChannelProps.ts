import { IpcRequest } from './IPCRequest';

export default class RequestChannelProps implements IpcRequest {
  requestType: string;
  
  requestData: any;
  
  responseChannel?: string;
}
