import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import ModbusService from '@src/main/ModbusService';

class RegisterLMDIOSetup extends RegisterBase {
  private accessAddress = 61881;

  private dataAddress = 61882;

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    const size = 18;
    const access = ModbusService.read<number[]>(this.accessAddress, 1);
    const data = ModbusService.read<Number[]>(this.dataAddress, 27);
    // return forkJoin([access, data]).pipe(
    //   map((data) => {
    //     const [access, buffer] = data;
    //   }),
    // );
    return undefined;
  }

  setter(_data: any): void {}
}
