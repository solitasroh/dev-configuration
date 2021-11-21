import LMInformation from '@src/Data/A2700.LMInformation';
import A2700Data from '@src/Data/A2700Data';
import { map, Observable } from 'rxjs';
import ModbusService from '../../ModbusService';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterLMInformation extends RegisterBase {
  setter = (data: A2700Data): void => {
    // nothing to do
  };

  getter = (_props?: RegisterProps): Observable<A2700Data> => {
    const { data: reqPartnerInfo } = _props;
    const addr = !reqPartnerInfo ? 61501 : 61513;
    return ModbusService.read<number[]>(addr, 11).pipe(
      map((data) => {
        const result = new LMInformation();

        const [
          operationState, // 61501
          productCode, // 61502
          hSerialNumber, // 61503-4
          lSerialNumber,
          hHardwareRevision, // 61505
          lHardwareRevision, // 61506
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          reserved1,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          reserved2,
          pcbVersion, // 61509
          applicationVersion, // 61510
          bootloaderVersion, // 61511
        ] = data as number[];

        result.setOperationState(operationState);
        result.setProductCode(productCode >> 8, productCode & 0xff);
        result.setSerialNumber((hSerialNumber << 16) | lSerialNumber);
        result.hardwareRevision = (hHardwareRevision << 16) | lHardwareRevision;
        result.pcbVersion = pcbVersion;
        result.applicationVersion =
          LMInformation.getAppVersion(applicationVersion);
        result.bootloaderVersion =
          LMInformation.getAppVersion(bootloaderVersion);

        return result;
      }),
    );
  };
}
