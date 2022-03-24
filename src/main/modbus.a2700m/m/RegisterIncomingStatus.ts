import A2700Data from '@src/Data/A2700Data';
import A2700DataType from '@src/Data/A2700DataType';
import ModbusService from '@src/main/ModbusService';
import { forkJoin, map, Observable } from 'rxjs';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export class IncomingStatus implements A2700Data {
  type: A2700DataType = 51001;

  Port1Count: number;
  Port2Count: number;
  ActiveState: boolean;
  ModuleRingBroken: boolean;
  A2700DHDisconnected: boolean;
  mismatchState: boolean;
  mccName: string;
}

export default class RegisterIncomingStatus extends RegisterBase {
  type = 'register incoming state';

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    return this.fetch();
  }

  setter(_data: any): void {
    console.log('empty setter');
  }

  private fetch = () => {
    return forkJoin([
      ModbusService.write(65535, [60000]),
      ModbusService.read<number[]>(65510, 7),
      ModbusService.write(65535, [0]),
      ModbusService.read<boolean[]>(1995, 5, { isCoil: true }),
      ModbusService.read<number[]>(51001, 15),
    ]).pipe(
      map((resp) => {
        const [, debugInfo, , commState, nameSetup] = resp;

        const [
          isAbnormalState,
          rs485RingType,
          rs485ABranchCount,
          rs485BBranchCount,
          swRingType,
          swABranchCount,
          swBBranchCount,
        ] = debugInfo;

        const [
          moduleConnAlarm,
          displayConnAlarm,
          activeState,
          ethernetConnAlarm,
          mismatchAlarm,
        ] = commState;

        const mccName = RegisterIncomingStatus.getNameBuffer(nameSetup);

        const result = new IncomingStatus();
        result.Port1Count = rs485ABranchCount;
        result.Port2Count = rs485BBranchCount;
        result.ActiveState = activeState;
        result.ModuleRingBroken = moduleConnAlarm;
        result.A2700DHDisconnected = displayConnAlarm;
        result.mccName = mccName;
        result.mismatchState = mismatchAlarm;
        return result;
      }),
    );
  };

  private static getNameBuffer(nameBuffer: number[]): string {
    const buf: number[] = [];
    nameBuffer.forEach((b: number) => {
      if (b !== 0) {
        buf.push(b >> 8);
        buf.push(b & 0xff);
      }
    });

    return String.fromCharCode(...buf);
  }
}
