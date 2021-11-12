
import A2750LMSetupReg from './lmh/A2750LMSetup';
import A2750LMInformationReg from './lmh/A2700LMInformation';
import A2750LDInformationReg from './lmh/A2750LDInformation';
// factory�� ����� register �׸��..
// ���� �������͸� Ȯ�� ������ �ϸ� ��..
const userMap = {
  A2750LMSetup: A2750LMSetupReg,
  A2750LMInformation: A2750LMInformationReg,
  A2750LDInformation: A2750LDInformationReg,
}

type UserMap = typeof userMap;
type Keys = keyof UserMap;
type Tuples<T> = T extends Keys ? [T, InstanceType<UserMap[T]>] : never;
type SingleKeys<K> = [K] extends (K extends Keys ? [K] : never) ? K : never;
type ClassType<A extends Keys> = Extract<Tuples<Keys>, [A, any]>[1];

class RegisterFactory {
    static getRegister<K extends Keys>(k: SingleKeys<K>) : ClassType<K> {
        return new userMap[k]();
    }
}

export default RegisterFactory;