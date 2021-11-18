import A2750LMSetupReg from './lmh/RegisterLMSetup';
import A2750LMInformationReg from './lmh/RegisterLMInformation';
import RegisterLDInformation from './lmh/RegisterLDInformation';
import A2750IOInformationReg from './lmh/RegisterIOInformation';

const userMap = {
  A2750LMSetup: A2750LMSetupReg,
  A2750LMInformation: A2750LMInformationReg,
  A2750LDInformation: RegisterLDInformation,
  A2750IOInformation: A2750IOInformationReg,
};

export type UserMap = typeof userMap;
export type Keys = keyof UserMap;
type Tuples<T> = T extends Keys ? [T, InstanceType<UserMap[T]>] : never;
type SingleKeys<K> = [K] extends (K extends Keys ? [K] : never) ? K : never;
type ClassType<A extends Keys> = Extract<Tuples<Keys>, [A, any]>[1];

class RegisterFactory {
  static getRegister<K extends Keys>(k: SingleKeys<K>): ClassType<K> {
    return new userMap[k]();
  }
}

export default RegisterFactory;
