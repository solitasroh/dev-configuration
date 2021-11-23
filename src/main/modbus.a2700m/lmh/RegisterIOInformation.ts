import IOInformation from '@src/Data/A2700.IOInformation';
import A2700Data from '@src/Data/A2700Data';
import { forkJoin, map, Observable } from 'rxjs';
import ModbusService from '../../ModbusService';
import RegisterBase from '../RegisterBase';

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 */
function chunkArray(myArray: any, chunkSize: number) {
  if (!(myArray instanceof Array)) {
    return null;
  }

  const results = [];
  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize));
  }

  return results;
}

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
            const tmpInfo = new IOInformation();
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
              IOInformation.getAppVersion(applicationVersion);
            tmpInfo.bootloaderVersion =
              IOInformation.getAppVersion(bootloaderVersion);
            return tmpInfo;
          });
        }),
      );
  };
}
