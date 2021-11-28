import A2700Data from '@src/Data/A2700Data';
import MeasureData from '@src/Data/MeasureData';
import ModbusService from '@src/main/ModbusService';
import { map, Observable } from 'rxjs';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterDOMeasure extends RegisterBase {
  getter = (_params?: RegisterProps): Observable<A2700Data | A2700Data[]> => {
    const { id } = _params;
    const address = 2357 + (id - 1) * 12;

    return ModbusService.read<boolean[]>(address, 6, { isCoil: true }).pipe(
      map((data) => {
        const result = new MeasureData<boolean>(6);
        data.forEach((value, index) => {
          result.setValue(index, value);
        });
        return result;
      }),
    );
  };

  setter = (_data: A2700Data): void => {
    console.log('empty setter');
  };
}
