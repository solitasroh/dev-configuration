import A2700Data from '@src/Data/A2700Data';
import IOCommand from '@src/Data/IOCommand';
import ModbusService from '@src/main/ModbusService';
import { Observable } from 'rxjs';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterIOCommand extends RegisterBase {
  getter = (_params?: RegisterProps): Observable<A2700Data | A2700Data[]> => {
    throw new Error('Method not implemented.');
  };

  // eslint-disable-next-line class-methods-use-this
  setter = (cmd: any): void => {
    const arg = cmd as IOCommand;
    const { id } = arg;
    const values = arg.data.map((item) => item.value === 1);
    const addr = 2357 + (id - 1) * 12;
    ModbusService.writeCoils(addr, values).subscribe();
  };
}
