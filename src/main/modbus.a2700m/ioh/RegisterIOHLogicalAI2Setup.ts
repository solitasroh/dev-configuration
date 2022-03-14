import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import ModbusService from '@src/main/ModbusService';
import IOHLogicAISetup from '@src/Data/IOHLogicAISetup';

export default class RegisterIOHLogicalAI2Setup extends RegisterBase {
  private idSetAddress = 61931;
  private accessAddress = 61932;
  private dataAddress = 61934;

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    console.log('ioh logical ai2 setup access id : ', _params.id);
    const registerAccessID = ModbusService.write(this.idSetAddress, [
      _params.id,
    ]);

    const registerAccess = ModbusService.read<number[]>(this.accessAddress, 1);
    const registerData = ModbusService.read<number[]>(this.dataAddress, 84);

    return forkJoin([registerAccessID, registerAccess, registerData]).pipe(
      map((resp) => {
        const [_, acc, buffer] = resp;
        const setup = new IOHLogicAISetup();

        if (acc[0] === 0x8000) {
          let off = 0;
          for (let i = 0; i < 12; i += 1, off += 1) {
            setup.aiSetups[i].aiType = buffer[off];
          }

          for (let i = 0; i < 12; i += 1, off += 1) {
            setup.aiSetups[i].unit = buffer[off];
          }

          for (let i = 0; i < 12; i += 1, off += 1) {
            setup.aiSetups[i].mapping = buffer[off];
          }
          for (let i = 0; i < 12; i += 1, off += 2) {
            setup.aiSetups[i].minValue =
              (buffer[off] << 16) | (buffer[off + 1] & 0xffff);
          }

          for (let i = 0; i < 12; i += 1, off += 2) {
            setup.aiSetups[i].maxValue =
              (buffer[off] << 16) | (buffer[off + 1] & 0xffff);
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
    const aiTypes = [];
    const units = [];
    const mapping = [];
    const minValue = [];
    const maxValue = [];

    for (let i = 0; i < 12; i += 1) {
      aiTypes.push(_data.setup.aiSetups[i].aiType);
      units.push(_data.setup.aiSetups[i].unit);
      mapping.push(_data.setup.aiSetups[i].mapping);
      minValue.push(_data.setup.aiSetups[i].minValue & 0xffff);
      minValue.push((_data.setup.aiSetups[i].minValue >> 16) & 0xffff);
      maxValue.push(_data.setup.aiSetups[i].maxValue & 0xffff);
      maxValue.push((_data.setup.aiSetups[i].maxValue >> 16) & 0xffff);
    }

    buffer.push(...aiTypes, ...units, ...mapping, ...minValue, ...maxValue);

    const ob1 = ModbusService.write(this.dataAddress, buffer);
    const ob2 = ModbusService.write(this.accessAddress, [1]);

    forkJoin([unlock, registerAccessID, registerAccess, ob1, ob2]).subscribe({
      next: () => {},
      complete: () => {},
    });
  }
}
