import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import ModbusService from '@src/main/ModbusService';
import LMHLogicSetup from '@src/Data/LMHLogicSetup';

export default class RegisterLMDISetup extends RegisterBase {
  private accessAddress = 61881;

  private dataAddress = 61882;

  private size = 18;

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    const access = ModbusService.read<number[]>(this.accessAddress, 1);
    const data = ModbusService.read<number[]>(this.dataAddress, this.size);

    return forkJoin([access, data]).pipe(
      map((d) => {
        const [acc, buffer] = d;
        const setup = new LMHLogicSetup(this.size);
        if (acc[0] === 0x8000) {
          for (let i = 0; i < this.size; i += 1) {
            const diSetup = buffer[i];

            setup.detail[i].polarity = +diSetup & 0xf;
            setup.detail[i].mapping = +diSetup >> 8;
          }
        }

        return setup;
      }),
    );
  }

  setter(_data: LMHLogicSetup): void {
    this.unlockSetup();

    const buffer = [];
    for (let i = 0; i < this.size; i += 1) {
      const value = _data.detail[i].polarity | (_data.detail[i].mapping << 8);
      buffer.push(value);
    }

    ModbusService.write(this.dataAddress, buffer).subscribe();
    ModbusService.write(this.accessAddress, [1]).subscribe();
  }
}
