import A2700Data from '@src/Data/A2700Data';
import LMTestModeData from '@src/Data/LMTestModeData';
import ModbusService from '@src/main/ModbusService';
import { Observable } from 'rxjs';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterLMTestMode extends RegisterBase {

  getter = (_params?: RegisterProps): Observable<A2700Data | A2700Data[]> => {
    throw new Error('Method not implemented.');
  };

  // eslint-disable-next-line class-methods-use-this
  setter<T extends A2700Data>(_data: T ): void {
    const {
        data
    } = _data as unknown as LMTestModeData;
    console.log(data);
    const values = data.map((item) => item.value);
    
    ModbusService.write(63640, values).subscribe();

    if (_data instanceof LMTestModeData) {
        console.log('lm test mode set ', _data);
        console.log('test mode set to a2700m', _data);
        
    }
  };
}
