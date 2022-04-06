import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import { forkJoin, map, Observable } from 'rxjs';
import A2700Data from '@src/Data/A2700Data';
import ModbusService from '@src/main/ModbusService';
import A2700DataType from '@src/Data/A2700DataType';
export class A2750DOSetupData implements A2700Data {
  type: A2700DataType;

  setup: number[];

  constructor(setup: number[]) {
    this.setup = setup;
  }
}

export class RegisterDISetup extends RegisterBase {
  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    const id = _params.id;

    return forkJoin([
      ModbusService.write(51831, [id]),
      ModbusService.read<number[]>(51832, 1),
      ModbusService.read<number[]>(51833, 10),
    ]).pipe(
      map((resp) => {
        const [, access, setupData] = resp;
        if (access[0] === 0x8000) return new A2750DOSetupData(setupData);
        return [];
      }),
    );
  }

  setter(_data: any): void {
    const id = _data.id;
    const data = _data.setup;

    forkJoin([
      this.unlockSetup(),
      ModbusService.write(51831, [id]),
      ModbusService.read<number[]>(51832, 1),
      ModbusService.write(51833, data),
      ModbusService.write(51832, [1]),
    ])
      .pipe()
      .subscribe();
  }
}

export class RegisterDOSetup extends RegisterBase {
  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    const id = _params.id;

    return forkJoin([
      ModbusService.write(51851, [id]),
      ModbusService.read<number[]>(51852, 1),
      ModbusService.read<number[]>(51853, 4),
    ]).pipe(
      map((resp) => {
        const [, access, setupData] = resp;
        if (access[0] === 0x8000) return new A2750DOSetupData(setupData);
        return [];
      }),
    );
  }

  setter(_data: any): void {
    const id = _data.id;
    const data = _data.setup;

    forkJoin([
      this.unlockSetup(),
      ModbusService.write(51851, [id]),
      ModbusService.read<number[]>(51852, 1),
      ModbusService.write(51853, data),
      ModbusService.write(51852, [1]),
    ])
      .pipe()
      .subscribe();
  }
}
