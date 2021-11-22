import A2700Data from '@src/Data/A2700Data';
import { Observable } from 'rxjs';
import RegisterProps from './RegisterProps';
import RegisterFactory from './RegisterFactory';

export default class A2700Register {
  Get = (
    key: any,
    params?: RegisterProps,
  ): Observable<A2700Data | A2700Data[]> => {
    const reg = RegisterFactory.getRegister(key);

    return reg.getter(params);
  };

  Set = (key: any, data: any): void => {
    const reg = RegisterFactory.getRegister(key);
    reg.setter(data);
  };
}
