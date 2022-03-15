import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import ModbusService from '@src/main/ModbusService';
import LMHLogicSetup from '@src/Data/LMHLogicSetup';

export default class RegisterIOHLogicalDIOSetup extends RegisterBase {
  private accessAddress = 61910;
  private idSetAddress = 61909;
  private dataAddress = 61913;

  private size = 17; // di: 11 , do: 6

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    const registerAccessID = ModbusService.write(this.idSetAddress, [
      _params.id,
    ]);
    const registerAccess = ModbusService.read<number[]>(this.accessAddress, 1);
    const registerData = ModbusService.read<number[]>(this.dataAddress, 17);

    return forkJoin([registerAccessID, registerAccess, registerData]).pipe(
      map((resp) => {
        const [, acc, buffer] = resp;
        const setup = new LMHLogicSetup(this.size);

        if (acc[0] === 0x8000) {
          for (let i = 0; i < 11; i += 1) {
            const diSetup = buffer[i];
            setup.diSetups[i].mapping = +diSetup & 0xff;
            setup.diSetups[i].polarity = +diSetup >> 8;
          }

          for (let i = 0; i < 6; i += 1) {
            const doSetup = buffer[i + 11];
            setup.doSetups[i].mapping = (+doSetup >> 8) & 0xff;
          }
        }
        return setup;
      }),
    );
  }

  async setter(_data: any): Promise<void> {
    const unlock = await this.unlockSetup();
    const registerAccessID = ModbusService.write(this.idSetAddress, [_data.id]);
    const registerAccess = ModbusService.read<number[]>(this.accessAddress, 1);

    const buffer = [];

    for (let i = 0; i < 11; i += 1) {
      const value =
        _data.setup.diSetups[i].mapping |
        (_data.setup.diSetups[i].polarity << 8);
      buffer.push(value);
    }

    for (let i = 0; i < 6; i += 1) {
      const value = _data.setup.doSetups[i].mapping | (0x0 << 8);
      buffer.push(value);
    }

    const ob1 = ModbusService.write(this.dataAddress, buffer);
    const ob2 = ModbusService.write(this.accessAddress, [1]);

    forkJoin([unlock, registerAccessID, registerAccess, ob1, ob2]).subscribe({
      next: () => {},
      complete: () => {},
    });
  }
}
