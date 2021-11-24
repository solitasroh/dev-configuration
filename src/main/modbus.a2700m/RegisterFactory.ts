import RegisterLMSetup from './lmh/RegisterLMSetup';
import RegisterLMInformation from './lmh/RegisterLMInformation';
import RegisterLDInformation from './lmh/RegisterLDInformation';
import RegisterIOInformation from './lmh/RegisterIOInformation';
import RegisterPCStatus from './pc/RegisterPCStatus';
import RegisterAIMeausre from './ioh/RegisterAIMeasure';
import RegisterLMTestMode from './lmh/RegisterLMTestMode';
import RegisterIOTestMode from './lmh/RegisterIOTestMode';
import RegisterAITestMode from './lmh/RegisterAITestMode';
import RegisterLMDIMeasure from './lmh/RegisterLMDIMeasure';
import RegisterMissmatchState from './lmh/RegisterMissmatchState';
import RegisterPCCommand from './pc/RegisterPCCommand';
import RegisterLMDOMeasure from './lmh/RegisterLMDOMeasure';
import RegisterDIMeasure from './ioh/RegisterDIMeasure';
import RegisterDOMeasure from './ioh/RegisterDOMeasure';
import RegisterIOCommand from './ioh/RegisterIOCommand';

const userMap = {
  A2750LMInformation: RegisterLMInformation,
  A2750LDInformation: RegisterLDInformation,
  A2750IOInformation: RegisterIOInformation,
  A2750PCStatus: RegisterPCStatus,
  A2750LMSetup: RegisterLMSetup,
  AIMeasure: RegisterAIMeausre,
  LMDIData:RegisterLMDIMeasure, 
  LMDOData:RegisterLMDOMeasure, 
  IODIData:RegisterDIMeasure, 
  IODOData:RegisterDOMeasure,
  LMTestSet: RegisterLMTestMode,
  IODiTest: RegisterIOTestMode,
  IOAiTest: RegisterAITestMode,
  MissMatchState: RegisterMissmatchState,
  PCCommand: RegisterPCCommand,
  IOCommand: RegisterIOCommand,
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
