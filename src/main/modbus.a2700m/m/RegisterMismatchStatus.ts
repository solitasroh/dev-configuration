import A2700Data from '@src/Data/A2700Data';
import A2700DataType from '@src/Data/A2700DataType';
import ModbusService from '@src/main/ModbusService';
import { map, Observable } from 'rxjs';
import RegisterBase from '../RegisterBase';
import RegisterProps from '../RegisterProps';

const OperationState = ['Unidentified', 'Bootloader', 'Sync', 'operating'];

const IOHTypeString = [
  'INVALID',
  'DI', //1
  'DO', //2
  'DI2', //3
  'DO2', //4
  'DIO', //5
  'AI', //6
  'AIO', //7
  'AI2', //8
];

const IOHType = {
  INVALID: 0,
  DI: 1,
  DO: 2,
  DI2: 3,
  DO2: 4,
  DIO: 5,
  AI: 6,
  AIO: 7,
  AI2: 8,
};

export class MissmatchData implements A2700Data {
  type: A2700DataType;

  mismatchType: number;

  detail1: number;
  detail2: number;
  detail3: number;
  detail4: number;
  detail5: number;

  constructor(
    mismatchType: number,
    detail1: number,
    detail2: number,
    detail3: number,
    detail4: number,
    detail5: number,
  ) {
    this.mismatchType = mismatchType;
    this.detail1 = detail1;
    this.detail2 = detail2;
    this.detail3 = detail3;
    this.detail4 = detail4;
    this.detail5 = detail5;
  }

  getMismatchInfo = () => {
    switch (this.mismatchType) {
      case 0: { // lmh status mismatch
        return MissmatchData.getLMHStatusMissmatchDetailMessage(
          this.detail1,
          this.detail2,
        );
      }
      case 1: { // lmh di mismatch
        return MissmatchData.getLMHDIOStatusMismatchDetailMessage(
          this.detail1,
          this.detail2,
          18,
        );
      }
      case 2: {
        return MissmatchData.getLMHDIOStatusMismatchDetailMessage(
          this.detail1,
          this.detail2,
          9,
        );
      }
      case 3: { // ioh id mismatch
        return MissmatchData.getLMHDIOStatusMismatchDetailMessage(
          this.detail1,
          this.detail2,
          15,
        );
      }
      case 4: {
        return MissmatchData.getIOHTypeMissmatchMessage(this.detail1);
      }
      case 5: {
        return MissmatchData.getIOHIOStatusMissmatchMessage(
          this.detail1,
          this.detail2,
          this.detail3,
          this.detail4,
          this.detail5,
        );
      }
      default:
        return '';
    }
  };

  static getLMHStatusMissmatchDetailMessage(op1: number, op2: number) {
    return `PORT1: ${OperationState[op1]} PORT2: ${OperationState[op2]}`;
  }

  static getLMHDIOStatusMismatchDetailMessage(
    di1: number,
    di2: number,
    cnt: number,
  ) {
    let res = 'different {';
    const diCompare = di1 ^ di2;
    for (let i = 0; i < cnt; i += 1) {
      if ((diCompare & (1 << i)) > 0) {
        res += `${i + 1}`;
      }
    }
    res += ' }';
    return res;
  }

  static getIOHTypeMissmatchMessage(typeDif: number) {
    let res = 'different {';
    for (let i = 0; i < 15; i += 1) {
      if ((typeDif & (1 << i)) > 0) {
        res += `${i + 1}`;
      }
    }
    res += ' }';
    return res;
  }

  static getIOHIOStatusMissmatchMessage(
    id: number,
    type: number,
    channel: number,
    data1: number,
    data2: number,
  ) {
    if (type === IOHType.DIO) {
      // dio
      return `A2750IOH-DIO${id} ${MissmatchData.getLMHDIOStatusMismatchDetailMessage(
        data1,
        data2,
        11,
      )} `;
    } else if (type === IOHType.AI2) {
      return `A2750IOH-AI2${id} channel${channel} ${data1}:${data2}`;
    }
    return '';
  }
}

export default class RegisterMismatchStatus extends RegisterBase {
  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    return this.fetch();
  }

  setter(_data: any): void {
    console.log('empty setter');
  }

  private fetch = () => {
    return ModbusService.read<number[]>(63680, 6).pipe(
      map((missmatch) => {
        const [mismatchType, detail1, detail2, detail3, detail4, detail5] =
          missmatch;
        return new MissmatchData(
          mismatchType,
          detail1,
          detail2,
          detail3,
          detail4,
          detail5,
        );
      }),
    );
  };
}
