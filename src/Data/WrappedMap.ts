import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

class WrappedMap implements A2700Data {
  type: A2700DataType = A2700DataType.WrappedMap;

  wrappedAddress: number;

  length: number;

  page: number;

  address: number;

}

export default WrappedMap;
