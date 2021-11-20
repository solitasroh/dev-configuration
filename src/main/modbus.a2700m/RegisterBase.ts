import { Observable } from 'rxjs';
import A2700Data from '@src/Data/A2700Data';
import RegisterProps from './RegisterProps';
import ModbusService from '../ModbusService';

abstract class RegisterBase {
  abstract getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]>;

  abstract setter(_data: A2700Data): void;

  unlockSetup = (): void => {
    ModbusService.write(51000, [2300, 0, 1, 700]).subscribe();
  };
}

export default RegisterBase;
