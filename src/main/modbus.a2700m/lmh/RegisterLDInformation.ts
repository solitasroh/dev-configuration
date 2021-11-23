import LDInformation from '@src/Data/A2700.LDInformation';
import A2700Data from '@src/Data/A2700Data';
import { map, Observable } from 'rxjs';
import ModbusService from '../../ModbusService';
import RegisterBase from '../RegisterBase';

export default class RegisterLDInformation extends RegisterBase {
  setter = (_data: A2700Data): void => {
    // do nothing
  };

  getter = (): Observable<A2700Data> =>
    ModbusService.read<number[]>(61525, 10).pipe(
      map((data) => {
        const result = new LDInformation();

        const [
          operationState, //
          productCode, //
          hSerialNumber, //
          lSerialNumber,
          hardwareRevision, //
          applicationVersion, //
          kernelVersion,
          bootloaderVersion, //
          pcbVersion, //
        ] = data as number[];

        result.setOperationState(operationState);
        result.setProductCode(productCode >> 8, productCode & 0xff);
        result.setSerialNumber((hSerialNumber << 16) | lSerialNumber);
        result.hardwareRevision = hardwareRevision;
        result.pcbVersion = pcbVersion;
        result.applicationVersion =
          LDInformation.getAppVersion(applicationVersion);
        result.bootloaderVersion =
          LDInformation.getAppVersion(bootloaderVersion);
        result.kernelVersion = LDInformation.getAppVersion(kernelVersion);
        return result;
      }),
    );
}
