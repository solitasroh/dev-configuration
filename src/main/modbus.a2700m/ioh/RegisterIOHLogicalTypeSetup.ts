import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import ModbusService from '@src/main/ModbusService';
import IOHLogicalTypeSetup from '@src/Data/IOHLogicalTypeSetup';

export default class RegisterIOHLogicalTypeSetup extends RegisterBase {
  private mapPage = 0xffff;
  private dataAddress = 52004;

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    const pageChange = ModbusService.write(65535, [this.mapPage]);

    const data = ModbusService.read<number[]>(this.dataAddress, 15);

    const pageZeroChange = ModbusService.write(65535, [0]);
    return forkJoin([pageChange, data, pageZeroChange]).pipe(
      map((resp) => {
        const [_, d] = resp;
        const moduleTypeSetup = new IOHLogicalTypeSetup();
        for (let i = 0; i < 15; i += 1) {
          moduleTypeSetup.moduleTypes[i].moduleType = (d[i]);
          console.log(`module type = ${moduleTypeSetup.moduleTypes[i].moduleType}`);
        }
        return moduleTypeSetup;
      }),
    );
  }

  async setter(_data: any): Promise<void> {
    const buffer = [];
    for (let i = 0; i < 15; i += 1) {
      const type = (_data.moduleTypes[i].moduleType << 8 | 1);
      console.log(`module type = ${_data.moduleTypes[i].moduleType}`);
      buffer.push(type);
    }
    const pageChange = ModbusService.write(65535, [this.mapPage]);
    const data = ModbusService.write(this.dataAddress, buffer);

    forkJoin([pageChange, data]).subscribe();
  }
}
