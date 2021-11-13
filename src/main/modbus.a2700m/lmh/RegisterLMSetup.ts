import LMSetupData from '@src/Data/A2700.LMSetup';
import A2700Data from '@src/Data/A2700Data';
import { map, Observable, throwError } from 'rxjs';
import ModbusService from '../../ModbusService';
import RegisterBase from '../RegisterBase';

export default class A2750LMSetupReg extends RegisterBase {
  setter = (data: A2700Data): void => {
    if (data instanceof LMSetupData) {
      const buf = [
        data.operationMode,
        data.digitalOperation,
        data.alarmThreshold,
        data.analogDeadband,
      ];

      this.unlockSetup();

      const dataWrite = ModbusService.write(64011, buf).pipe(
        map((x) => {
          if (x as string) {
            throwError(() => false);
          }
          return true;
        }),
      );

      dataWrite.subscribe(() => {
        ModbusService.write(64010, [1]).subscribe();
      });
    }
  };

  getter = (): Observable<A2700Data> =>
    ModbusService.read(64010, 5).pipe(
      map((data) => {
        const result = new LMSetupData();

        const [
          access, // 64010
          operationMode, // 64011
          digitalOperation, // 64012
          alarmThreshold, // 64013
          analogDeadband, // 64014
        ] = data as number[];

        result.access = access;
        result.operationMode = operationMode;
        result.digitalOperation = digitalOperation;
        result.alarmThreshold = alarmThreshold;
        result.analogDeadband = analogDeadband;

        return result;
      }),
    );
}
