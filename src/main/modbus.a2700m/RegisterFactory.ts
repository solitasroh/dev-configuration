
import ModbusRTU from 'modbus-serial';
import A2750LMSetupReg from './A2750LMSetup';
// factory에 등록할 register 항목들..
// 추후 레지스터를 확장 구현만 하면 됨..
const userMap = {
  A2750LMSetup: A2750LMSetupReg,
}

type UserMap = typeof userMap;
type Keys = keyof UserMap;
type Tuples<T> = T extends Keys ? [T, InstanceType<UserMap[T]>] : never;
type SingleKeys<K> = [K] extends (K extends Keys ? [K] : never) ? K : never;
type ClassType<A extends Keys> = Extract<Tuples<Keys>, [A, any]>[1];

class RegisterFactory {
    static getRegister<K extends Keys>(k: SingleKeys<K>, client: ModbusRTU) : ClassType<K> {
        return new userMap[k](client);
    }
}

export default RegisterFactory;