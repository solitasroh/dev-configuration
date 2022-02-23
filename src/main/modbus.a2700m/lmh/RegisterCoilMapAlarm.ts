import A2700Data from '@src/Data/A2700Data';
import CoilAlarm from '@src/Data/CoilMapAlarm';
import MeasureData from '@src/Data/MeasureData';
import ModbusService from '@src/main/ModbusService';
import { map, Observable } from 'rxjs';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterCoilMapAlarm extends RegisterBase {
  getter = (_params?: RegisterProps): Observable<A2700Data | A2700Data[]> => {
    const address = 1994;

    return ModbusService.read<boolean[]>(address, 5, { isCoil: true }).pipe(
      map((data) => {
        const alarmData = new CoilAlarm();
        const [
          ringState,
          displayDisconnect,
          activeStatus,
          ethernetDisconnect,
          lmhMismatch,
        ] = data;

        alarmData.ringState = ringState;
        alarmData.displayDisconnect = displayDisconnect;
        alarmData.activeStatus = activeStatus;
        alarmData.ethernetDisconnect = ethernetDisconnect;
        alarmData.lmhMismatch = lmhMismatch;

        return alarmData;
      }),
    );
  };

  setter = (_data: A2700Data): void => {
    // do nothing
  };
}
