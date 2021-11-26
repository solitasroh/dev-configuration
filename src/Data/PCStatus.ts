import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export default class PCStatus implements A2700Data {
  type: A2700DataType;

  id: number;

  startingBlock: boolean;

  motorOperationState: boolean;

  remoteStatus: boolean;

  abnormalState: boolean;

  alarmState: boolean;

  faultState: boolean;

  di1: boolean;

  di2: boolean;

  di3: boolean;

  di4: boolean;

  di5: boolean;

  di6: boolean;

  di7: boolean;

  di8: boolean;

  di9: boolean;

  di10: boolean;

  do1: boolean;

  do2: boolean;

  do3: boolean;

  do4: boolean;

  ocr: boolean;

  thr: boolean;

  pocr: boolean;

  psr: boolean;

  ubcr: boolean;

  jam: boolean;

  lsr: boolean;

  grzct: boolean;

  grct: boolean;

  ucr: boolean;

  mccbTrip: boolean;

  constructor(id: number, data?: boolean[]) {
    this.id = id;
    if (data != null) {
      const [
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        res1, // start command
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        res2, // stop command
        startingBlock,
        motorOperationState,
        remoteModeState,
        abnormalState,
        alarmState,
        faultState,
        di1,
        di2,
        di3,
        di4,
        di5,
        di6,
        di7,
        di8,
        di9,
        di10,
        do1,
        do2,
        do3,
        do4,
        ocr,
        thr,
        pocr,
        psr,
        ubcr,
        jam,
        lsr,
        grzct,
        grct,
        ucr,
        mccbTrip,
      ] = data;

      this.startingBlock = startingBlock;
      this.motorOperationState = motorOperationState;
      this.remoteStatus = remoteModeState;
      this.abnormalState = abnormalState;
      this.alarmState = alarmState;
      this.faultState = faultState;

      this.di1 = di1;
      this.di2 = di2;
      this.di3 = di3;
      this.di4 = di4;
      this.di5 = di5;
      this.di6 = di6;
      this.di7 = di7;
      this.di8 = di8;
      this.di9 = di9;
      this.di10 = di10;
      this.do1 = do1;
      this.do2 = do2;
      this.do3 = do3;
      this.do4 = do4;
      this.ocr = ocr;
      this.thr = thr;
      this.pocr = pocr;
      this.psr = psr;
      this.ubcr = ubcr;
      this.jam = jam;
      this.lsr = lsr;
      this.grzct = grzct;
      this.grct = grct;
      this.ucr = ucr;
      this.mccbTrip = mccbTrip;
    }
  }
}
