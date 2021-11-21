import A2700Data from '@src/Data/A2700Data';
import chunkArray from '@src/Utils';
import { concat, map, Observable, of } from 'rxjs';
import {
  LMHChainViewModuleInfo,
  LMHChainViewData,
} from '@src/Data/LMHChainViewData';

import ModbusService from '../../ModbusService';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterIOHConnectionInfo extends RegisterBase {
  private parse = (data: number[]) => {
    const result = new LMHChainViewData();
    const [
      cvInfoChanged,
      saveRingSts,
      currRingSts,
      saveModuleCount,
      currModuleCount,
      displayModuleCnt,
    ] = data;
    const infoArray = data.slice(6, 6 + 4 * 15 + 1);

    const moduleInfos = chunkArray(infoArray, 4).map((item) => {
      const [id, type, display, internalId] = item;
      const moduleInfo = new LMHChainViewModuleInfo();
      moduleInfo.moduleId = id;
      moduleInfo.mdouleType = type;
      moduleInfo.moduleDisplayStatus = display;
      moduleInfo.moduleInternalId = internalId;
      return moduleInfo;
    });

    result.chainViewInfoChanged = cvInfoChanged === 1;
    result.savedRingStatus = saveRingSts;
    result.currentRingStatus = currRingSts;
    result.savedModuleCount = saveModuleCount;
    result.currentModuleCount = currModuleCount;
    result.displayModuleCount = displayModuleCnt;

    result.moduleInfoList = moduleInfos;

    return result;
  };

  setter = (data: A2700Data): void => {
    // nothing to do
  };

  getter = (_props?: RegisterProps): Observable<A2700Data> => {
    const { data: id } = _props;
    // const fetchId = id === 1 ? 1 : 2;

    // const write = ModbusService.write(61733, [fetchId]);

    const read = ModbusService.read<number[]>(61734, 99).pipe(
      map((data) => this.parse(data)),
    );

    return read;
  };
}
