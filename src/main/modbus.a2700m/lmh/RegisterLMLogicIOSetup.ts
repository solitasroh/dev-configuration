import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import ModbusService from '@src/main/ModbusService';
import LMHLogicSetup from '@src/Data/LMHLogicSetup';

export default class RegisterLMLogicIOSetup extends RegisterBase {
  private accessAddress = 61881;

  private dataAddress = 61882;

  private size = 27; // di: 18 , do: 9

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    const access = ModbusService.read<number[]>(this.accessAddress, 1);
    const data = ModbusService.read<number[]>(this.dataAddress, this.size);

    return forkJoin([access, data]).pipe(
      map((d) => {
        const [acc, buffer] = d;
        const setup = new LMHLogicSetup(this.size);
        if (acc[0] === 0x8000) {
          for (let i = 0; i < 18; i += 1) {
            const diSetup = buffer[i];

            setup.diSetups[i].polarity = +diSetup & 0xf;
            setup.diSetups[i].mapping = +diSetup >> 8;
          }

          for (let i = 0; i < 9; i += 1) {
            const doSetup = buffer[i + 18];
            setup.doSetups[i].mapping = (+doSetup >> 8) & 0xf;
          }
        }

        return setup;
      }),
    );
  }

  setter(_data: LMHLogicSetup): void {
    this.unlockSetup();

    const buffer = [];
    for (let i = 0; i < 18; i += 1) {
      const value = _data.diSetups[i].polarity | (_data.detail[i].mapping << 8);
      buffer.push(value);
    }

    for (let i = 0; i < 9; i += 1) {
      const value = _data.detail[i].mapping << 8;
      buffer.push(value);
    }

    ModbusService.write(this.dataAddress, buffer).subscribe();
    ModbusService.write(this.accessAddress, [1]).subscribe();
  }
}