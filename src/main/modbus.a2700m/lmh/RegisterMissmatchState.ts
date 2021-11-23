import A2700Data from '@src/Data/A2700Data';
import LMMissmatchState from '@src/Data/LMMissmatchState';
import ModbusService from '@src/main/ModbusService';
import { catchError, forkJoin, map, Observable } from 'rxjs';
import RegisterBase from '../RegisterBase';

export default class RegisterMissmatchState extends RegisterBase {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setter = (data: A2700Data): void => {};

  getter = (): Observable<A2700Data> => {
    const ob1 = ModbusService.read<boolean[]>(1999, 1, { isCoil: true });
    const ob2 = ModbusService.read<number[]>(63680, 6);
    return forkJoin([ob1, ob2]).pipe(
      map((item) => {
        const [missMatchAlarm, missMatchState] = item;
        const result = new LMMissmatchState();
        // eslint-disable-next-line prefer-destructuring
        const [alarm] = missMatchAlarm;
        const [missMatch, detail1, detail2, detail3, detail4, detail5] =
          missMatchState as number[];
        console.log("alarm:",alarm);
        result.missMatchAlarm = alarm;

        result.setMissMatchType(missMatch);
        result.setDetail(
          missMatch,
          detail1,
          detail2,
          detail3,
          detail4,
          detail5,
        );
        return result;
      }),
      catchError((err) => {
        console.log(err);
        return [];
      }),
    );
  };
}
