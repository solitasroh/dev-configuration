import A2700Data from '@src/Data/A2700Data';
import A2750PCStatus from '@src/Data/A2750PCStatus';
import chunkArray from '@src/Utils';
import { map, Observable } from 'rxjs';
import ModbusService from '../../ModbusService';
import RegisterBase from '../RegisterBase';

export default class RegisterPCStatus extends RegisterBase {
  setter = (data: A2700Data): void => {
    console.log(`empty setter ${data.type}`);
  };

  getter = (): Observable<A2700Data[]> =>
    ModbusService.read<boolean[]>(1, 1321, { isCoil: true }).pipe(
      map((data) => this.parseData(data)),
    );

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  parseData = (data: boolean[]) => {
    const chunkBuf = chunkArray(data, 33);

    return chunkBuf.map((buf, index) => {
      const pcStatus = new A2750PCStatus(index + 1, buf);
      return pcStatus;
    });
  };
}
