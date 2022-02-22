import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export default class LMHLogicSetup implements A2700Data {
  type: A2700DataType = A2700DataType.LMHLogicSetup;

  access: number;

  detail: {
        diMappingPolarity: number;
        doMapping: number;
  }[];

  diMappingPolarity: number[];

  doMapping: number[];

  constructor(channelCounts: number) {
    this.detail = [];
    this.doMapping = [];
    this.diMappingPolarity = [];
    for (let index = 0; index < channelCounts; index += 1) {
      this.detail.push({
        diMappingPolarity: 0,
        doMapping: index,
      });
        this.diMappingPolarity.push(0);
        this.doMapping.push(index);
    }
  }
}
