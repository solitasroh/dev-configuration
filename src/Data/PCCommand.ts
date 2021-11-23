import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export default class PCCommand implements A2700Data {
  type: A2700DataType;

  id: number;

  command: number;
}
