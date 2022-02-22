import A2700Data from '@src/Data/A2700Data';
import LMHLogicSetup from '@src/Data/LMHLogicSetup';
import MeasureData from '@src/Data/MeasureData';
import ModbusService from '@src/main/ModbusService';
import { map, Observable } from 'rxjs';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterLMLogicSetup extends RegisterBase {
  getter = (_params?: RegisterProps): Observable<A2700Data | A2700Data[]> => {
    const address = 2000;

    return ModbusService.read<number[]>(address, 324).pipe(
      map((data) => {
        const LogicData = new LMHLogicSetup(18);

        // const [
        //     access, 

        //   ] = data as number[];

        return LogicData;
      }),
    );
  };

  setter = (_data: A2700Data): void => {
    // do nothing
  };
}
