import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import { catchError, forkJoin, map, Observable } from 'rxjs';
import A2700Data from '@src/Data/A2700Data';
import ModbusService from '@src/main/ModbusService';
import UserDefineIOData, { DefinedIO } from '@src/Data/UserDefineIOData';

export default class RegisterLMHLogicalUserIO extends RegisterBase {
  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    // userio1-10
    const result = new UserDefineIOData();
    const ob1 = ModbusService.read<number[]>(61940, 12 * 10);
    const ob2 = ModbusService.read<number[]>(62060, 12 * 10);
    const ob3 = ModbusService.read<number[]>(62188, 12 * 7);
    return forkJoin([ob1, ob2, ob3]).pipe(
      map((data) => {
        const [uint1to10, unit11to20, unit21to27] = data;
        const first = this.parseResult(uint1to10, 10);
        const second = this.parseResult(unit11to20, 10);
        const third = this.parseResult(unit21to27, 7);
        result.definedIO = [...first, ...second, ...third];
        return result;
      }),
      catchError((err) => {
        console.log(err);
        return [];
      }),
    );
  }

  setter(data: any): void {
    this.unlockSetup();

    if (data instanceof UserDefineIOData) {
      const arr = [];
      const res = data.definedIO.map((ioData) => {
        const nameBuffer = Buffer.from(ioData.name);
        const nameData = Array.from(nameBuffer);
        return [ioData.type, ioData.mapping, ...nameData];
      });

      // const dataWrite = ModbusService.write(61940, )
    }
  }

  parseResult = (data: number[], length: number) => {
    const arr: DefinedIO[] = [];
    for (let i = 0; i < length; i += 1) {
      const startOffset = i * 12;
      const res = data.slice(startOffset, startOffset + 2);
      const [type, mapping] = res;

      const nameArray = data.slice(startOffset + 3, startOffset + 12);
      const name = String.fromCharCode(...nameArray).toString();

      arr.push({
        type: type,
        mapping: mapping,
        name: name,
      });
    }
    return arr;
  };
}
