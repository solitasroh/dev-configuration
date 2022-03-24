import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import MotorUnitStatusData from '@src/Data/MotorUnitStatus';
import ModbusService from '@src/main/ModbusService';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import chunkArray from '@src/Utils';

export interface GeneralDIOSetup {
  programIndex: number;
  dioType: number;
  channel: number;
  name: string;
}

export default class RegisterMotorUnitStatus extends RegisterBase {
  setter = (data: A2700Data): void => {
    console.log('empty setter');
  };

  getter = ({ id }: RegisterProps): Observable<A2700Data[] | A2700Data> => {
    const accessIdAddress = 51051;
    const accessAddress = 51052;
    const statusAddress = (id - 1) * 33 + 1;
    const setupLen = 64;
    const statusLen = 33;
    const opStatusAddress = 10001 + (id - 1) * 700;

    const accessId = ModbusService.write(accessIdAddress, [id]);

    const readMotorUnitGeneralSetup = ModbusService.read<number[]>(
      accessAddress,
      setupLen,
    );

    const opStatus = ModbusService.read<number[]>(opStatusAddress, 1);

    const statusRegister = ModbusService.read<Boolean[]>(
      statusAddress,
      statusLen,
      {
        isCoil: true,
      },
    );

    return forkJoin([
      accessId,
      readMotorUnitGeneralSetup,
      opStatus,
      statusRegister,
      this.getDISetup(id),
      this.getDOSetup(id),
      this.getGeneralDIOSetupName(id),
    ]).pipe(
      map((resp) => {
        const [, setup, operation, status, diSetup, doSetup, generalDioSetup] =
          resp;

        const charBuffer: number[] = [];
        setup.slice(16, 31).forEach((b: number) => {
          charBuffer.push(b >> 8);
          charBuffer.push(b & 0xff);
        });
        const name = String.fromCharCode(...charBuffer);

        try {
          return new MotorUnitStatusData(
            id,
            name,
            operation[0],
            status,
            diSetup,
            doSetup,
            generalDioSetup,
          );
        } catch (e) {
          return undefined;
        }
      }),
    );
  };

  private getDISetup = (id: number): Observable<number[]> => {
    return forkJoin([
      ModbusService.write(51831, [id]),
      ModbusService.read<number[]>(51832, 1),
      ModbusService.read<number[]>(51833, 10),
    ]).pipe(
      map((resp) => {
        const [, access, setupData] = resp;
        if (access[0] === 0x8000) return setupData;
        return [];
      }),
    );
  };

  private getDOSetup = (id: number): Observable<number[]> => {
    return forkJoin([
      ModbusService.write(51851, [id]),
      ModbusService.read<number[]>(51852, 1),
      ModbusService.read<number[]>(51853, 4),
    ]).pipe(
      map((resp) => {
        const [, access, setupData] = resp;
        if (access[0] === 0x8000) return setupData;
        return [];
      }),
    );
  };

  // 14 dio
  private getGeneralDIOSetupName = (
    id: number,
  ): Observable<GeneralDIOSetup[]> => {
    return forkJoin([
      ModbusService.write(54401, [id]),
      ModbusService.read<number[]>(54402, 1),
      ModbusService.read<number[]>(54403, 140),
    ]).pipe(
      map((resp) => {
        const [, access, data] = resp;
        const setupBuffer = chunkArray(data, 10);

        return setupBuffer.map((setup: number[]) => {
          const nameBuffer = setup.slice(2, 10);
          return {
            programIndex: setup[0],
            dioType: setup[1] >> 8,
            channel: setup[1] & 0xff,
            name: RegisterMotorUnitStatus.getNameBuffer(nameBuffer),
          };
        });
      }),
    );
  };

  private static getCharCode(s: string) {
    const charCodeArr = [];

    for (let i = 0; i < s.length; i += 1) {
      const code = s.charCodeAt(i);
      charCodeArr.push(code);
    }
    return charCodeArr;
  }

  private static getNameBuffer(nameBuffer: number[]): string {
    const buf: number[] = [];
    nameBuffer.forEach((b: number) => {
      if (b !== 0) {
        buf.push(b >> 8);
        buf.push(b & 0xff);
      }
    });

    return String.fromCharCode(...buf);
  }
}
