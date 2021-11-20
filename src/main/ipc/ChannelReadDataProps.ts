import RegisterProps from '../modbus.a2700m/RegisterProps';
import { IpcRequest } from './IPCRequest';

export default class ChannelReadDataProps implements IpcRequest {
  requestType?: string;

  responseChannel?: string;

  props?: RegisterProps;
}
