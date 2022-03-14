import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';
export interface LogicModuleType {
  moduleType: number;
  exist: boolean;
}

export default class IOHLogicalTypeSetup implements A2700Data {
  type: A2700DataType = A2700DataType.LMHLogicSetup;
  moduleTypes: LogicModuleType[];

  constructor() {
    this.moduleTypes = [];
    for (let i = 0; i < 15; i += 1) {
      this.moduleTypes.push({ moduleType: 0, exist: false });
    }
  }
}
