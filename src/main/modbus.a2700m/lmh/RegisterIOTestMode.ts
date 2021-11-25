import A2700Data from '@src/Data/A2700Data';
import LMTestModeData from '@src/Data/LMTestModeData';
import ModbusService from '@src/main/ModbusService';
import { Observable } from 'rxjs';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterIOTestMode extends RegisterBase {
  getter = (_params?: RegisterProps): Observable<A2700Data | A2700Data[]> => {
    throw new Error('Method not implemented.');
  };

  // eslint-disable-next-line class-methods-use-this
  setter = (test: any): void => {
    const arg = test as LMTestModeData;
    const idType = arg.id << 8 | 5;
    const values = arg.data.map(item => item.value);
    const controlled = arg.data.map(item => item.controlled);
    let data = 0;
    let validityCh = 0;
    for (let i = 0; i < 11; i+=1) {
        if (values[i] === 1) {
            data |= (1 << i);
        }
        if(controlled[i]) {
          validityCh |= (1<<i);
        }
    }
    const buffer = [idType, 0, validityCh, 0, data];
    console.log(buffer);
    ModbusService.write(63658, buffer).subscribe();
  };
}
