import A2700Data from '@src/Data/A2700Data';
import MeasureData from '@src/Data/MeasureData';
import ModbusService from '@src/main/ModbusService';
import { map, Observable } from 'rxjs';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterLMDOMeasure extends RegisterBase {
  getter = (_params?: RegisterProps): Observable<A2700Data | A2700Data[]> => {
    const address = 2348;

    return ModbusService.read<boolean[]>(address, 9, { isCoil: true }).pipe(
      map((data) => {
        const measureData = new MeasureData<boolean>(9);

        data.forEach((value, index) => {
          measureData.setValue(index, value);
        });

        return measureData;
      }),
    );
  };

  setter = (_data: A2700Data): void => {
    // do nothing
  };
}
