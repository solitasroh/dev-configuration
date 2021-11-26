import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

class LMHSetupData implements A2700Data {
  type: A2700DataType = A2700DataType.LMSetup;

  access: number;

  operationMode: number;

  digitalOperation: number;

  analogDeadband: number;

  alarmThreshold: number;

  getOperationMode(): string {
    return this.operationMode === 0 ? 'Single Mode' : '2-Active Mode';
  }

  getDigitalOperation(): string {
    if (this.digitalOperation === 0) {
      return 'AND';
    }
    if (this.digitalOperation === 1) {
      return 'OR';
    }
    return 'UNDEFINED';
  }

  getAnalogDeadband(): number {
    return this.analogDeadband;
  }

  getAlarmThreshold(): number {
    return this.alarmThreshold;
  }
}

export default LMHSetupData;
