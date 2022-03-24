import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export default class MeasureData<T> implements A2700Data {
  type: A2700DataType;

  detail: {
    channel: number;
    value: T;
  }[];

  constructor(channelCounts: number, defaultValue?: T) {
    this.detail = [];

    for (let index = 0; index < channelCounts; index += 1) {
      this.detail.push({
        channel: index + 1,
        value: defaultValue,
      });
    }
  }

  public setValue(index: number, value: T): void {
    if (this.detail.length <= index) {
      return;
    }
    this.detail[index].value = value;
  }

  public getValue(channel: number): T {
    return this.detail.find((t) => t.channel === channel).value;
  }
}
