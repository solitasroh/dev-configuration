import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import ModbusService from '@src/main/ModbusService';
import LMHLogicSetup from '@src/Data/LMHLogicSetup';
import chunkArray from '@src/Utils';

export default class RegisterLMDIOSetup extends RegisterBase {
  private accessAddress = 61881;

  private dataAddress = 61882;

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    const size = 18;
    const access = ModbusService.read<number[]>(this.accessAddress, 1);
    const data = ModbusService.read<Number[]>(this.dataAddress, 27);
    return forkJoin([access, data]).pipe(
      map((data) => {
        const [access, buffer] = data;
        console.log(`get logic setup`);
        console.log(buffer);
        const setup = new LMHLogicSetup(size);

        for (let i = 0; i < size; i += 1) {
          const diSetup = buffer[i];

          setup.detail[i].diPolarity = +diSetup & 0xf;
          setup.detail[i].diMapping = +diSetup >> 8;
        }
        for (let i = 18; i < 27; i += 1) {
          const doSetup = buffer[i];
          setup.detail[i - 18].doMapping = +doSetup >> 8;
        }
        console.log(setup.detail);
        return setup;
      }),
    );
  }

  setter(_data: LMHLogicSetup): void {
    this.unlockSetup();

    const buffer = [];
    for (let i = 0; i < 18; i += 1) {
      const value =
        _data.detail[i].diPolarity | (_data.detail[i].diMapping << 8);
      buffer.push(value);
    }
    for (let i = 18; i < 27; i += 1) {
      buffer.push(_data.detail[i - 18].doMapping << 8);
    }

    ModbusService.write(this.dataAddress, buffer).subscribe();
    ModbusService.write(this.accessAddress, [1]).subscribe();
  }
}
