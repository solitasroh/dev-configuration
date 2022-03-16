import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import MotorUnitStatusData, {
  MotorUnitStatus,
} from '@src/Data/MotorUnitStatus';
import ModbusService from '@src/main/ModbusService';
import chunkArray from '@src/Utils';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';

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
    ]).pipe(
      map((resp) => {
        const [, setup, operation, status] = resp;

        const sts = new MotorUnitStatusData();
        sts.moduleId = id;
        sts.motorStatus = status[3] ? 1 : 0;
        sts.controlMode = status[4] ? 1 : 0;
        sts.operationMode = operation[0];
        const charBuffer: number[] = [];
        setup.slice(16, 31).forEach((b: number) => {
          charBuffer.push(b >> 8);
          charBuffer.push(b & 0xff);
        });
        sts.name = String.fromCharCode(...charBuffer);
        return sts;
      }),
    );
  };
}
