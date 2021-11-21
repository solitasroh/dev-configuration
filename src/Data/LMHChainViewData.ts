import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export class LMHChainViewModuleInfo {
  moduleId: number;

  mdouleType: number;

  moduleDisplayStatus: number;

  moduleInternalId: number;
}

export class LMHChainViewConnInfo {
  displayType: number;

  reserved: number;
}

export class LMHChainViewData implements A2700Data {
  type: A2700DataType;

  chainViewInfoChanged: boolean;

  savedRingStatus: number;

  currentRingStatus: number;

  savedModuleCount: number;

  currentModuleCount: number;

  displayModuleCount: number;

  moduleInfoList: LMHChainViewModuleInfo[];

  moduleConnList: LMHChainViewConnInfo[];
}
