import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import { forkJoin, map, Observable } from 'rxjs';
import A2700Data from '@src/Data/A2700Data';
import ModbusService from '@src/main/ModbusService';
import UserDefineIOData, { DefinedIO } from '@src/Data/UserDefineIOData';
import chunkArray, { chunkArray2 } from '@src/Utils';

export default class RegisterLMHUserDefineIOSetup extends RegisterBase {
  private accessAddress = 62020;

  private dataAddress = 62021;

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    const unit = 12;
    const read = ModbusService.read<number[]>(62020, 1);
    const ob1 = ModbusService.read<number[]>(this.dataAddress, unit * 10);
    const ob2 = ModbusService.read<number[]>(
      this.dataAddress + unit * 10,
      unit * 10,
    );

    const ob3 = ModbusService.read<number[]>(
      this.dataAddress + unit * 20,
      unit * 7,
    );

    return forkJoin([read, ob1, ob2, ob3]).pipe(
      map((data, index) => {
        const [access, unit1, unit2, unit3] = data;
        if (access[0] === 0x8000) {
          const res = Array.of(...unit1, ...unit2, ...unit3);
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
    const observable = this.unlockSetup();

    ModbusService.read<number[]>(this.accessAddress, 1);

    // io data
    let offset = 0;
    const data: DefinedIO[][] = chunkArray2<DefinedIO>(_data.definedIO, 10);

    const observables = data.map((splitData) => {
      let writeBuffer: number[] = [];
      splitData.forEach((ioData) => {
        const tmp = [ioData.type, ioData.mapping];
        const nameTmp = [];

        const nameArray = RegisterLMHUserDefineIOSetup.getCharCode(ioData.name);

        for (let i = 0; i < 20; i += 2) {
          if (nameArray.length > i) {
            nameTmp.push((nameArray[i] << 8) | nameArray[i + 1]);
          } else {
            nameTmp.push('\0'.charCodeAt(0));
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

    observables.push();

    const ob = forkJoin([observable, ...observables]);
    ob.subscribe({
      complete: () => {
        ModbusService.write(this.accessAddress, [1]).subscribe();
      },
    });
  }

  private parse(buffer: number[]) {
    const chucked = chunkArray(buffer, 12);
    return chucked.map((data, index) => {
      const nameBuffer = data.slice(2, 12);
      const buf: number[] = [];
      nameBuffer.forEach((b: number) => {
        if (b !== 0) {
          buf.push(b >> 8);
          buf.push(b & 0xff);
        }
      });

      const name = String.fromCharCode(...buf);
      const definedIO: DefinedIO = {
        type: data[0],
        mapping: data[1],
        name,
        key: index,
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
