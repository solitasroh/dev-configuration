import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export default class LMTestModeData implements A2700Data {
  type: A2700DataType;

  data : {
      channel: number;
      value: number;
  }[];
  
}
