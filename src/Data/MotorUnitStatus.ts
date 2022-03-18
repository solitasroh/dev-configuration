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
  type: A2700DataType = 51051;

  readonly moduleId: number;

  readonly name: string;

  readonly motorStatus: number;

  readonly controlMode: number;

  readonly operationMode: number;

  readonly faultStatus: boolean;

  readonly alarmStatus: boolean;

  readonly abnormalStatus: boolean;

  readonly diStatus: boolean[];

  readonly doStatus: boolean[];

  constructor(
    id: number,
    name: string,
    operationMode: number,
    status: Boolean[],
  ) {
    this.moduleId = id;
    this.motorStatus = status[3] ? 1 : 0;
    this.controlMode = status[4] ? 1 : 0;
    this.faultStatus = status[7].valueOf();
    this.alarmStatus = status[6].valueOf();
    this.operationMode = operationMode;

    this.name = name;

    this.diStatus = status.slice(8, 17).map((b) => b.valueOf());
    this.doStatus = status.slice(18, 21).map((b) => b.valueOf());
  }
}
