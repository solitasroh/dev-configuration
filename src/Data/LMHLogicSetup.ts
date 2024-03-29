import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export interface LogicIOProps {
  name?: string;
  polarity?: number;
  mapping?: number;
}

export default class LMHLogicSetup implements A2700Data {
  type: A2700DataType = A2700DataType.LMHLogicSetup;

  access: number;

  detail: LogicIOProps[];

  diSetups: LogicIOProps[];

  doSetups: LogicIOProps[];

  constructor(channelCounts: number) {
    this.detail = [];
    this.diSetups = [];
    this.doSetups = [];
    for (let index = 0; index < channelCounts; index += 1) {
      this.detail.push({
        polarity: 0,
        mapping: 0,
      });
    }

    for (let index = 0; index < channelCounts; index+=1) {
      this.diSetups.push({
        polarity: 0,
        mapping : 0,
      })
    }
    for (let index = 0; index < channelCounts; index+=1) {
      this.doSetups.push({
        polarity: 0,
        mapping : 0,
      })
    }
  }
}
