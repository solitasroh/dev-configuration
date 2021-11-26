import A2700Data from '@src/Data/A2700Data';
import PCInfoData from '@src/Data/PCInfoData';
import { map, Observable } from 'rxjs';
import ModbusService from '../../ModbusService';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 */
export default class RegisterPCInformation extends RegisterBase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setter = (_data: A2700Data): void => {
    //
  };

  getter = ({ id }: RegisterProps): Observable<A2700Data | A2700Data[]> => {
    const address = 10001 + (id - 1) * 700;
    const information = new PCInfoData();

    return ModbusService.read<number[]>(address, 21).pipe(
      map((data) => {
        const [state] = data;
        information.setOperationState(state);
        return information;
      }),
    );
  };
}
