import A2700DataType from '@src/Data/A2700DataType';
import { IpcRequest } from './IPCRequest';

export default class RequestChannelProps implements IpcRequest {
  requestType: A2700DataType;

  responseChannel?: string;
}
