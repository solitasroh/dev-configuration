import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import { forkJoin, map, Observable } from 'rxjs';
import A2700Data from '@src/Data/A2700Data';
import ModbusService from '@src/main/ModbusService';
import UserDefineIOData, { DefinedIO } from '@src/Data/UserDefineIOData';
import chunkArray, { chunkArray2 } from '@src/Utils';

export default class RegisterIOHLogicalUserIO extends RegisterBase {
  private accessAddress = 62350;
  private accessIDAddress = 62351;
  private dataAddress = 62352;

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    const { id } = _params;

    const unit = 12;
    const ioCount = 22;

    const read = ModbusService.read<number[]>(this.accessAddress, 1);
    const registerModuleId = ModbusService.write(this.accessIDAddress, [id]);

    let remaining = ioCount * unit;
    let offset = 0;
    let readSize = 120;

    const observables: Observable<any>[] = [];

    while (remaining > 0) {
      const ob = ModbusService.read<number[]>(
        this.dataAddress + offset,
        readSize,
      );
      observables.push(ob);
      offset += readSize;
      remaining -= readSize;
      if (remaining < 120) {
        readSize = remaining;
      }
    }

    return forkJoin([read, registerModuleId, ...observables]).pipe(
      map((data) => {
        const [access, module_id, ...units] = data;
        console.log(`acc: ${access}, id: ${id}`);

        if (access[0] === 0x8000) {
          const res = Array.of(...units);
          console.log(res);
          const ioData = this.parse(res);
          const result = new UserDefineIOData();
          result.definedIO = ioData;
          return result;
        }
        return [];
      }),
    );
  }

  setter(_data: UserDefineIOData): void {
    const unlockSetupReg = this.unlockSetup();
    const { id } = _data;
    const accessReg = ModbusService.read<number[]>(this.accessAddress, 1);
    const registerModuleId = ModbusService.write(this.accessIDAddress, [id]);

    // io data
    let offset = 0;
    const data: DefinedIO[][] = chunkArray2<DefinedIO>(_data.definedIO, 10);
    const observables: Observable<any>[] = [];
    const bufferReg = data.map((splitData) => {
      let writeBuffer: number[] = [];
      splitData.forEach((ioData) => {
        const tmp = [ioData.type, ioData.mapping];
        const nameTmp = [];

        const nameArray = RegisterIOHLogicalUserIO.getCharCode(ioData.name);

        for (let i = 0; i < 20; i += 2) {
          if (nameArray.length > i) {
            nameTmp.push((nameArray[i] << 8) | nameArray[i + 1]);
          } else {
            nameTmp.push(0);
          }
        }
        const res = tmp.concat(...nameTmp);

        writeBuffer = writeBuffer.concat(...res);
      });

      const observable = ModbusService.write(
        this.dataAddress + offset,
        writeBuffer,
      );

      offset += writeBuffer.length;
      return observable;
    });

    observables.push(accessReg);
    observables.push(registerModuleId);
    observables.push(...bufferReg);

    const ob = forkJoin([unlockSetupReg, ...observables]);
    ob.subscribe({
      next: (value) => console.log('next : ', value),
      complete: () => {
        ModbusService.write(this.accessAddress, [1]).subscribe();
      },
    });
  }

  private parse(buffer: number[]) {
    const chucked = chunkArray(buffer, 12);
    return chucked.map((data) => {
      const nameBuffer = data.slice(2, 12);
      const buf: number[] = [];
      nameBuffer.forEach((b: number) => {
        buf.push(b >> 8);
        buf.push(b & 0xff);
      });

      const name = String.fromCharCode(...buf);
      const definedIO: DefinedIO = {
        type: data[0],
        mapping: data[1],
        name,
      };
      return definedIO;
    });
  }

  private static getCharCode(s: string) {
    const charCodeArr = [];

    for (let i = 0; i < s.length; i += 1) {
      const code = s.charCodeAt(i);
      charCodeArr.push(code);
    }
    return charCodeArr;
  }
}
