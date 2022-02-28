import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export interface LogicAIProps {
  inputType?: number;
  unitType?: number;
  mapping?: number;
  minValue?:number;
  maxValue?:number;
}

export default class IOHLogicSetup implements A2700Data {
  type: A2700DataType;

  access: number;

  detail: LogicAIProps[];

  constructor(channelCounts: number) {
    this.detail = [];
    for (let index = 0; index < channelCounts; index += 1) {
      this.detail.push({
        inputType: 0,
        unitType: 0,
        mapping: 0,
        minValue: 0,
        maxValue: 0,
      });
    }
  }
}
