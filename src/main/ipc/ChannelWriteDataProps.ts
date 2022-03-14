import A2700Data from '@src/Data/A2700Data';
import { IpcRequest } from './IPCRequest';

export default class ChannelWriteDataProps implements IpcRequest {
  requestType: string;

  writeData: A2700Data;

  responseChannel?: string;

  id?: number;
}
