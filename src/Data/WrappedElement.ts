import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

class WrappedElement implements A2700Data {
  type: A2700DataType = A2700DataType.WrappedElement;

  wrappedAddress: number;

  length: number;

  page: number;

  address: number;
  
  key: string;

  desc: string;

  dataAddrOffset: number;

  userAddrOffset : number;

  numberOfDevice: number;

  setKey(key: string) {
    this.key = key;
  }
}

export default WrappedElement;
