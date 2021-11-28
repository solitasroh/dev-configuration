import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export default class IOCommand implements A2700Data {
  type: A2700DataType;

  id: number;

  channelCount: number;

  data: {
    channel: number;
    value: number;
  }[];

  constructor(channelCount = 6) {
    this.channelCount = channelCount;
    this.data = [];
    for (let i = 0; i < this.channelCount; i += 1) {
      this.data.push({
        channel: i + 1,
        value: 0,
      });
    }
  }

  command(channel: number, value: number): void {
    if (channel > this.data.length) {
      return;
    }

    this.data[channel - 1].value = value;
  }
}
