import IOHInfoData from '@src/Data/IOHInfoData';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import chunkArray from '@src/Utils';
import ModbusService from '../../ModbusService';
import RegisterBase from '../RegisterBase';

export default class RegisterIOInformation extends RegisterBase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setter = (_data: A2700Data): void => {
    //
  };

  getter = (): Observable<A2700Data | A2700Data[]> => {
    const first = ModbusService.read<number[]>(61553, 125);
    const second = ModbusService.read<number[]>(61553 + 125, 55);

    return forkJoin([first, second])
      .pipe(map(([s1, s2]) => [...s1, ...s2]))
      .pipe(
        map((data) => {
          const iosdata = chunkArray(data, 12);
          return iosdata.map((item, index) => {
            const tmpInfo = new IOHInfoData();
            const [
              operationState,
              moduleType,
              hSerialNumber,
              lSerialNumber,
              productCode,
              applicationVersion, // 61510
              bootloaderVersion, // 61511
              hardwareRevision,
              pcbVersion,
            ] = item as number[];

            tmpInfo.id = index + 1;
            tmpInfo.setModuleType(moduleType);
            tmpInfo.setOperationState(operationState);
            tmpInfo.setProductCode(productCode >> 8, productCode & 0xff);
            tmpInfo.setSerialNumber((hSerialNumber << 16) | lSerialNumber);
            tmpInfo.hardwareRevision = hardwareRevision;
            tmpInfo.pcbVersion = pcbVersion;
            tmpInfo.applicationVersion =
              IOHInfoData.getAppVersion(applicationVersion);
            tmpInfo.bootloaderVersion =
              IOHInfoData.getAppVersion(bootloaderVersion);
            return tmpInfo;
          });
        }),
      );
  };
}
