import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export interface LogicAIProps {
  name?: string;
  aiType?: number;
  unit?: number;
  mapping?: number;
  minValue?: number;
  maxValue?: number;
}

export default class IOHLogicAISetup implements A2700Data {
  type: A2700DataType = A2700DataType.LMHUserIOSetup;

  aiSetups: LogicAIProps[];

  constructor() {
    this.aiSetups = [];

    for (let i = 0; i < 12; i += 1) {
      this.aiSetups.push({
        aiType: 0,
        unit: 0,
        mapping: 0,
        minValue: 0,
        maxValue: 0,
      });
    }
  }
}
