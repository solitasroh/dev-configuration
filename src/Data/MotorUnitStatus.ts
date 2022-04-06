import A2700Data from '@src/Data/A2700Data';
import A2700DataType from '@src/Data/A2700DataType';
import { GeneralDIOSetup } from '@src/main/modbus.a2700m/pc/RegisterMotorUnitStatus';

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

  readonly generalDIData: string[];

  readonly generalDOData: string[];

  readonly diSetup: number[];

  readonly doSetup: number[];

  readonly currentAvg: number[];

  readonly IAvg: number;

  readonly UnitType: string;

  constructor(
    id: number,
    name: string,
    operationMode: number,
    status: Boolean[],
    diSetup: number[],
    doSetup: number[],
    generalDIOSetup: GeneralDIOSetup[],
    currentAvg: number[],
    unitTypeRaw: number,
  ) {
    this.moduleId = id;
    this.motorStatus = status[3] ? 1 : 0;
    this.controlMode = status[4] ? 1 : 0;
    this.faultStatus = status[7].valueOf();
    this.alarmStatus = status[6].valueOf();
    this.operationMode = operationMode;
    this.currentAvg = currentAvg;

    this.name = name;

    this.diStatus = status.slice(8, 18).map((b) => b.valueOf());
    this.doStatus = status.slice(18, 22).map((b) => b.valueOf());
    this.diSetup = diSetup;
    this.doSetup = doSetup;
    if (generalDIOSetup === undefined || generalDIOSetup.length === 0) {
      return;
    }

    this.generalDIData = Array.from({ length: 14 });
    this.generalDOData = Array.from({ length: 14 });

    for (let i = 0; i < 14; i += 1) {
      if (generalDIOSetup[i] === undefined) {
        continue;
      }
      if (generalDIOSetup[i].dioType === 1) {
        this.generalDIData[generalDIOSetup[i].channel - 1] =
          generalDIOSetup[i].name;
      } else if (generalDIOSetup[i].dioType === 2) {
        this.generalDOData[generalDIOSetup[i].channel - 1] =
          generalDIOSetup[i].name;
      }
    }

    try {
      const buf = MotorUnitStatusData.convertByteArray(currentAvg);
      this.IAvg = buf.readFloatBE(0);
    } catch (e) {
      console.log(e);
    }

    if (unitTypeRaw === 0) {
      this.UnitType = 'P';
    } else if (unitTypeRaw === 1) {
      this.UnitType = 'PC';
    } else if (unitTypeRaw === 2) {
      this.UnitType = 'PH';
    }
  }

  private static convertByteArray(buffer: number[]): Buffer {
    const byteArray = [];

    byteArray.push(buffer[0] >> 8);
    byteArray.push(buffer[0] & 0xff);
    byteArray.push(buffer[1] >> 8);
    byteArray.push(buffer[1] & 0xff);
    return Buffer.from(byteArray);
  }
}
