import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

class LMManagementSetup implements A2700Data {
  type: A2700DataType = A2700DataType.LMManagementMode;

  access: number;

  managementMode: number;

  getOperationMode(): string {
    return this.managementMode === 1 ? 'LCG Mode' : 'LMH Mode';
  }
}

export default LMManagementSetup;
