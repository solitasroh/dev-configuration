import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export default class LMTestModeData implements A2700Data {
  type: A2700DataType;

  id: number;

  data: {
    channel: number;
    value: number;
    controlled: boolean;
  }[];

  constructor(channelCount = 12) {
    this.data = [];
    for (let i = 0; i < channelCount; i+=1) {
      this.data.push({
        channel: i+1, value: 0, controlled: false,
      });
    }
  }
}
