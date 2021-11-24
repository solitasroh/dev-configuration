import A2700Data from '@src/Data/A2700Data';
import PCCommand from '@src/Data/PCCommand';
import ModbusService from '@src/main/ModbusService';
import { Observable } from 'rxjs';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterPCCommand extends RegisterBase {
  getter = (_params?: RegisterProps): Observable<A2700Data | A2700Data[]> => {
    throw new Error('Method not implemented.');
  };

  // eslint-disable-next-line class-methods-use-this
  setter = (test: any): void => {
    const arg = test as PCCommand;
    const { id, command } = arg;
    if (command === 1) {    // start
        const address = 1 + (id-1) * 33;
        console.log("write pc command ", address);
        ModbusService.writeCoils(address, [true]).subscribe();
    } else if (command === 2) {
        const address = 2 + (id - 1 ) * 33;
        ModbusService.writeCoils(address, [true]).subscribe();
    } else if (command === 3) { // control block : on
        const address = 3 + (id - 1) * 33;
        ModbusService.writeCoils(address, [true]).subscribe();
    } else if (command === 4) { // control block : off
        const address = 3 + (id - 1) * 33;
        ModbusService.writeCoils(address, [false]).subscribe();
    }
  };
}
