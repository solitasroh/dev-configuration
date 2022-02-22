import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export interface LogicIOProps {
  name?: string;
  key?: string;
  diPolarity: number;
  diMapping: number;
  doMapping: number;
}

export default class LMHLogicSetup implements A2700Data {
  type: A2700DataType = A2700DataType.LMHLogicSetup;

  access: number;

  detail: LogicIOProps[];

  constructor(channelCounts: number) {
    this.detail = [];
    for (let index = 0; index < channelCounts; index += 1) {
      this.detail.push({
        key: `${index}`,
        diPolarity: 0,
        diMapping: 0,
        doMapping: 0,
      });
    }
  }
}
