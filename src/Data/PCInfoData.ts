import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export default class PCInfoData implements A2700Data {
  type: A2700DataType;

  operationStatus: string;

  setOperationState(state: number): void {
    if (state === 0) this.operationStatus = 'Disconnected';
    if (state === 1) this.operationStatus = 'ID conflict';
    if (state === 2) this.operationStatus = 'Bootloader';
    if (state === 3) this.operationStatus = 'Booting';
    if (state === 4) this.operationStatus = 'Operating';
    this.operationStatus = 'Invalid';
  }
}
