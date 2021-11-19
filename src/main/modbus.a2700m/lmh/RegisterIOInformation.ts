import IOInformation from '@src/Data/A2700.IOInformation';
import A2700Data from '@src/Data/A2700Data';
import { map, Observable } from 'rxjs';
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

export default class A2750IOInformationReg extends RegisterBase {
  private id: number;

  setter = (data: A2700Data): void => {
    console.log(`empty setter ${data.type}`);
  };

  getter = (params: any): Observable<A2700Data | A2700Data[]> => {
    const { id } = params;
    let addr = 61552;
    let length = 12;
    if (id === 0) {
      length = 12 * 15;
      addr = 61542;
    } else {
      addr = 61552 + (id - 1) * 12;
      length = 12;
    }

    return ModbusService.read(addr, length).pipe(
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
          tmpInfo.id = index+1;
          tmpInfo.moduleType = moduleType;
          tmpInfo.setOperationState(operationState);
          tmpInfo.setProductCode(productCode >> 8, productCode & 0xff);
          tmpInfo.setSerialNumber((hSerialNumber << 16) | lSerialNumber);
          tmpInfo.hardwareRevision = hardwareRevision;
          tmpInfo.pcbVersion = pcbVersion;
          tmpInfo.applicationVersion = IOInformation.getAppVersion(applicationVersion);
          tmpInfo.bootloaderVersion =  IOInformation.getAppVersion(bootloaderVersion);
          return tmpInfo;
        });
      }),
    );
  };
}
