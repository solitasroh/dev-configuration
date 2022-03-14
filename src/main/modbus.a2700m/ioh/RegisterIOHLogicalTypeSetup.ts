import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import ModbusService from '@src/main/ModbusService';
import IOHLogicalTypeSetup from '@src/Data/IOHLogicalTypeSetup';

export default class RegisterIOHLogicalTypeSetup extends RegisterBase {
  private idSetAddress = 61909;
  private accessAddress = 61910;
  private dataAddress = 61911;

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    console.log('ioh logical io setup access id : ', _params.id);
    const registerAccessID = ModbusService.write(this.idSetAddress, [
      _params.id,
    ]);
    const registerAccess = ModbusService.read<number[]>(this.accessAddress, 1);
    const registerData = ModbusService.read<number[]>(this.dataAddress, 1);

    return forkJoin([registerAccessID, registerAccess, registerData]).pipe(
      map((resp) => {
        const [_, acc, buffer] = resp;
        const setup = new IOHLogicalTypeSetup();

        if (acc[0] === 0x8000) {
          const type = buffer[0] >> 8;
          const exist = buffer[0] & 0xff;
          setup.type = type;
          setup.exist = exist === 1;
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

    const type = _data.type;
    const exist = _data.exist ? 1 : 0;

    buffer.push(type | (exist << 8));

    const ob1 = ModbusService.write(this.dataAddress, buffer);
    const ob2 = ModbusService.write(this.accessAddress, [1]);

    forkJoin([unlock, registerAccessID, registerAccess, ob1, ob2]).subscribe({
      next: () => {},
      complete: () => {},
    });
  }
}
