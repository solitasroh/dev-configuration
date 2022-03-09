import { forkJoin, map, Observable } from 'rxjs';
import A2700Data from '@src/Data/A2700Data';
import RegisterProps from './RegisterProps';
import ModbusService from '../ModbusService';

abstract class RegisterBase {
  abstract getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]>;

  abstract setter(_data: any): void;

  unlockSetup = (): Observable<boolean> => {
    const ob1 = ModbusService.write(51000, [2300]);
    const ob2 = ModbusService.write(51000, [0]);
    const ob3 = ModbusService.write(51000, [700]);
    const ob4 = ModbusService.write(51000, [1]);
    return forkJoin([ob1, ob2, ob3, ob4]).pipe(
      map((x) => true),
    );
  };
}

export default RegisterBase;
