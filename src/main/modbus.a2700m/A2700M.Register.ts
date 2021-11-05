import * as modbusTs from 'modbus.ts';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import A2700Data from '@src/Data/A2700Data';
import LMSetupData from '../../Data/A2700.LMSetup';
import A2700DataType from '../../Data/A2700DataType';

class A2700Register {
  private Client: modbusTs.tcp.Client;

  constructor(client: modbusTs.tcp.Client) {
    this.Client = client;
  }

  Request(data: A2700DataType): Observable<A2700Data> {
    if (data === A2700DataType.LMSetup) {
      return this.Client.readHoldingRegisters(64010, 5).pipe(
        map((res) => {
          const result = new LMSetupData();
          const { values } = res.data;

          const [
            access,
            operationMode, // 64011
            digitalOperation, // 64012
            alarmThreshold, // 64013
            analogDeadband, // 64014
          ] = values as number[];

          result.access = access;
          result.operationMode = operationMode;
          result.digitalOperation = digitalOperation;
          result.alarmThreshold = alarmThreshold;
          result.analogDeadband = analogDeadband;

          // console.log(values);

          return result;
        }),
      );
    }
    return null;
  }
}

export default A2700Register;
