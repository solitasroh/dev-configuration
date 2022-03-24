import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import ModbusService from '@src/main/ModbusService';
import IOHLogicAISetup from '@src/Data/IOHLogicAISetup';
import { ConsoleSqlOutlined } from '@ant-design/icons';

export default class RegisterIOHLogicalAI2Setup extends RegisterBase {
  private idSetAddress = 61931;
  private accessAddress = 61932;
  private dataAddress = 61934;

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
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
            const b = Buffer.alloc(4);
            b[0] = buffer[off] >> 8;
            b[1] = buffer[off] & 0xff;
            b[2] = buffer[off + 1] >> 8;
            b[3] = buffer[off + 1] & 0xff;
            setup.aiSetups[i].minValue = b.readFloatBE();
          }

          for (let i = 0; i < 12; i += 1, off += 2) {
            const b = Buffer.alloc(4);
            b[0] = buffer[off] >> 8;
            b[1] = buffer[off];
            b[2] = buffer[off + 1] >> 8;
            b[3] = buffer[off + 1];
            setup.aiSetups[i].maxValue = b.readFloatBE();
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
      const b = Buffer.alloc(4);
      b.writeFloatBE(_data.setup.aiSetups[i].minValue);
      minValue.push((b[0] << 8) | b[1]);
      minValue.push((b[2] << 8) | b[3]);

      const c = Buffer.alloc(4);
      c.writeFloatBE(_data.setup.aiSetups[i].maxValue);
      maxValue.push((c[0] << 8) | c[1]);
      maxValue.push((c[2] << 8) | c[3]);
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
