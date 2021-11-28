import LDHInfoData from '@src/Data/LDHInfoData';
import A2700Data from '@src/Data/A2700Data';
import { map, Observable } from 'rxjs';
import ModbusService from '../../ModbusService';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterLDInformation extends RegisterBase {
  setter = (_data: A2700Data): void => {
    // do nothing
  };

  getter = (_props?: RegisterProps): Observable<A2700Data> => {
    const { data: reqPartnerInfo } = _props;
    const addr = !reqPartnerInfo ? 61525 : 61539;
    return ModbusService.read<number[]>(addr, 10).pipe(
      map((data) => {
        const result = new LDHInfoData();

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
          LDHInfoData.getAppVersion(applicationVersion);
        result.bootloaderVersion = LDHInfoData.getAppVersion(bootloaderVersion);
        result.kernelVersion = LDHInfoData.getAppVersion(kernelVersion);
        return result;
      }),
    );
  };
}
