import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import ModbusService from '@src/main/ModbusService';
import A2700DataType from '@src/Data/A2700DataType';

export class ValidMotorUnitList implements A2700Data {
  type: A2700DataType;
  valid: boolean[];
  constructor(buffer: number[]) {
    this.valid = Array.from({ length: 40 });

    this.valid = buffer.map((data) => {
      return data !== 0xffff;
    });

    console.log(`motor status = ${this.valid}`);
  }
}

export default class RegisterValidMotorUnit extends RegisterBase {
  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    return forkJoin([
      ModbusService.read<number[]>(50001, 40).pipe(
        map((stateData) => {
          return new ValidMotorUnitList(stateData);
        }),
      ),
    ]);
  }

  setter(_data: any): void {
    console.log('empty setter');
  }
}
