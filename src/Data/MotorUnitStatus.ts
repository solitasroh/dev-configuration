import A2700Data from '@src/Data/A2700Data';
import A2700DataType from '@src/Data/A2700DataType';

export interface MotorUnitStatus {
  key: number;

  moduleId: number;

  name: string;

  motorStatus: number;

  controlMode: number;
}

export default class MotorUnitStatusData implements A2700Data {
  type: A2700DataType = 2020;

  moduleId: number;

  name: string;

  motorStatus: number;

  controlMode: number;

  operationMode: number;
}
