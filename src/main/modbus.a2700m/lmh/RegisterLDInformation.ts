import LDInformation from '@src/Data/A2700.LDInformation';
import A2700Data from '@src/Data/A2700Data';
import { map, Observable } from 'rxjs';
import ModbusService from '../../ModbusService';
import RegisterBase from '../RegisterBase';

export default class RegisterLDInformation extends RegisterBase {
  getter = (): Observable<A2700Data> =>
    ModbusService.read(61524, 10).pipe(
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

        console.log(data);
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
