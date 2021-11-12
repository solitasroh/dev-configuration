import A2700Data from '@src/Data/A2700Data';
import { Observable } from 'rxjs';
import RegisterFactory from './RegisterFactory';

class A2700Register {
  Get = (key: any): Observable<A2700Data> => {
    const reg = RegisterFactory.getRegister(key);
    return reg.getter();
  }

  Set = (key: any, data: A2700Data): void  => {
    const reg = RegisterFactory.getRegister(key);
    reg.setter(data);
  }
}

export default A2700Register;
