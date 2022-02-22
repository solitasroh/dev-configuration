import A2700Data from '@src/Data/A2700Data';
import A2700DataType from '@src/Data/A2700DataType';

export interface DefinedIO {
  type: number;

  mapping: number;

  name: string;
}

export default class UserDefineIOData implements A2700Data {
  type: A2700DataType = A2700DataType.LMHUserIOSetup;

  definedIO: DefinedIO[];

  // constructor(count: number) {
  //   for (let i = 0; i < count; i += 1) {
  //     const data: DefinedIO = {
  //       type: 0,
  //       mapping: 0,
  //       name: '',
  //     };
  //     this.definedIO.push(data);
  //   }
  // }
}
