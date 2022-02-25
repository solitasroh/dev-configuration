import A2700Data from '@src/Data/A2700Data';
import CoilAlarm from '@src/Data/CoilMapAlarm';
import MeasureData from '@src/Data/MeasureData';
import ModbusService from '@src/main/ModbusService';
import { forkJoin, map, Observable } from 'rxjs';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterCoilMapAlarm extends RegisterBase {
  private alarmAddress = 1995;

  private pcStateAddress = 6;

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    const alarm = ModbusService.read<boolean[]>(this.alarmAddress, 5, {
      isCoil: true,
    });
    const pcState = ModbusService.read<boolean[]>(this.pcStateAddress, 2, {
      isCoil: true,
    });

    return forkJoin([alarm, pcState]).pipe(
      map((data) => {
        const [ala, pc] = data;
        const alarmData = new CoilAlarm();
        const [
          ringState,
          displayDisconnect,
          activeStatus,
          ethernetDisconnect,
          lmhMismatch,
        ] = ala;

        const [remote, abnormal] = pc;

        alarmData.ringState = ringState;
        alarmData.displayDisconnect = displayDisconnect;
        alarmData.activeStatus = activeStatus;
        alarmData.ethernetDisconnect = ethernetDisconnect;
        alarmData.lmhMismatch = lmhMismatch;
        alarmData.remote = remote;
        alarmData.abnormal = !abnormal;

        return alarmData;
      }),
    );
  }

  setter = (_data: A2700Data): void => {
    // do nothing
  };
}
