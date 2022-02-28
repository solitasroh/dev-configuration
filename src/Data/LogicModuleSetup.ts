import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export interface LogicTypeProps {
  type: number;
}

export default class LMHLogicSetup implements A2700Data {
  type: A2700DataType;

  access: number;

  detail: LogicTypeProps[];

  constructor(channelCounts: number) {
    this.detail = [];
    for (let index = 0; index < channelCounts; index += 1) {
      this.detail.push({
        type: 0,
      });
    }
  }
}
