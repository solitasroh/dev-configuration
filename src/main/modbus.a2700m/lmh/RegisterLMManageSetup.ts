
import A2700Data from '@src/Data/A2700Data';
import LMManagementSetup from '@src/Data/LMHManageSetup';
import { map, Observable, throwError } from 'rxjs';
import ModbusService from '../../ModbusService';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

export default class RegisterLMManageSetup extends RegisterBase {
  setter = (data: any): void => {
    console.log("register lm manage setup call", data);
    const arg = data as LMManagementSetup;
      const buf = [
        arg.managementMode,
      ];

      this.unlockSetup();
      ModbusService.write(65535, [0xffff]).subscribe();
      ModbusService.write(51040, buf).subscribe();
      ModbusService.write(65535, [0]).subscribe();
    //   dataWrite.subscribe(() => {
    //     ModbusService.write(51040, [1]).subscribe();
    //   });
    
  };

  getter = (_params?: RegisterProps): Observable<A2700Data | A2700Data[]> => 
  {    
    ModbusService.write(65535, [0xffff]).subscribe();
    const mode =  ModbusService.read<number[]>(51040, 5).pipe(
      map((data) => {
        const result = new LMManagementSetup();

        const [
          managementMode, // 64011
        ] = data as number[];

        result.managementMode = managementMode;
        return result;
      }),
    );    
    ModbusService.write(65535, [0]).subscribe();

    return mode;
  }
}
