import A2700Data from '@src/Data/A2700Data';
import A2750PCStatus from '@src/Data/A2750PCStatus';
import { map, Observable } from 'rxjs';
import ModbusService from '../../ModbusService';
import RegisterBase from '../RegisterBase';

export default class RegisterPCStatus extends RegisterBase {
  setter = (data: A2700Data): void => {
    console.log(`empty setter ${data.type}`);
  };

  getter = (): Observable<A2700Data> =>
    ModbusService.read(2, 6, {isCoil: true}).pipe(
      map((data) => {
        const result = new A2750PCStatus();

        const [
            startingBlock,
            motorOperationState,
            remoteModeState,
            abnormalState,
            alarmState,
            faultState,
        ] = data as boolean[];

        result.startingBlock = startingBlock;
        result.motorOperationState =motorOperationState;
        result.remoteStatus = remoteModeState;
        result.abnormalState = abnormalState;
        result.alarmState = alarmState;
        result.faultState = faultState;

        return result;
      }),
    );
}
