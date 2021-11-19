import A2700Data from '@src/Data/A2700Data';
import { Observable } from 'rxjs';
import ModbusService from '../ModbusService';
import IStuff from './IStuff';

abstract class RegisterBase implements IStuff {
  public getter = (params?: any): Observable<A2700Data | A2700Data[]> => null;

  public setter = (data: A2700Data): void => {
    console.log(`default setter : ${data}`);
  };

  unlockSetup = (): void => {
    ModbusService.write(51000, [2300, 0, 1, 700]).subscribe();
  };
}

export default RegisterBase;
