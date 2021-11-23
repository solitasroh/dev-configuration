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
    const idType = arg.id << 8 | 8;
    const values = arg.data.map(item => item.value);
    const buffer = [idType, 0, 0xFFF, 0].concat(values);
    console.log("AI Test Buffer",buffer);
    ModbusService.write(63658, buffer).subscribe();
  };
}
