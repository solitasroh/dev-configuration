import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

export default class LMMissmatchState implements A2700Data {
  type: A2700DataType;

  missMatchAlarm: boolean;

  missMatchType: string;

  detailType: string;

  detailType1: string;

  detailType2: string;

  setMissMatchType(missmatch: number): void {
    if (missmatch === 0) {
      this.missMatchType = 'operating missmatch';
    }

    switch (missmatch) {
      case 0:
        this.missMatchType = 'operating state';
        break;
      case 1:
        this.missMatchType = 'LMH DI';
        break;
      case 2:
        this.missMatchType = 'LMH DO';
        break;
      case 3:
        this.missMatchType = 'IOH ID';
        break;
      case 4:
        this.missMatchType = 'IOH TYPE';
        break;
      case 5:
        this.missMatchType = 'IOH IO Status';
        break;
      default:
        this.missMatchType = 'not missmatch';
        break;
    }
  }

  setDetail(
    missMatch: number,
    detail1: number,
    detail2: number,
    detail3: number,
    detail4: number,
    detail5: number,
  ): void {
    switch (missMatch) {
      case 0: // operating
      case 1: // lmh di
      case 2: // lmh do
        this.detailType1 = `${detail2}`;
        this.detailType2 = `${detail2}`;
        break;
      case 3: // lmh id missmatch
      case 4: // ioh type missmatch
        this.detailType1 = `${LMMissmatchState.parse(detail1, 15)}`;
        this.detailType2 = `${LMMissmatchState.parse(detail2, 15)}`;
        break;
      case 5:
        if (detail3 !== 0) {
          this.detailType = `DIO id: ${detail1}, type:${detail2}, ${detail4} ${detail5}`;
        }
        this.detailType = `AIO id: ${detail1}, type:${detail2}, ch:${detail3} val: ${detail4}, val:${detail5}`;
        break;

      default:
        this.detailType = 'not missmatch';
        break;
    }
  }

  static parse(di: number, count: number): string {
    let ret = '';
    let isFirst = true;
    for (let i = 0; i < count; i += 1) {
      if ((di & (1 << i)) > 0) {
        if (!isFirst) {
          ret = ret.concat(',');
        } else {
          isFirst = false;
        }
        ret = ret.concat(`${i + 1}`);
      }
    }

    return ret;
  }
}
