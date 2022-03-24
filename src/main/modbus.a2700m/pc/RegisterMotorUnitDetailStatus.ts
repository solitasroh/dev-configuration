import RegisterBase from '@src/main/modbus.a2700m/RegisterBase';
import RegisterProps from '@src/main/modbus.a2700m/RegisterProps';
import { Observable } from 'rxjs';
import A2700Data from '@src/Data/A2700Data';

export default class RegisterMotorUnitDetailStatus extends RegisterBase {
  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    return undefined;
  }

  setter(_data: any): void {}

  private getGeneraDIONameData = (id: number) => {};

  private getDIOStatusData = (id: number) => {};
}
