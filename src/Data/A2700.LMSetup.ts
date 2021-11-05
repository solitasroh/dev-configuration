import A2700Data from "./A2700Data";
import A2700DataType from "./A2700DATA_TYPE";

class LMSetupData implements A2700Data {

    type: A2700DataType= A2700DataType.LMSetup;
    
    operationMode: number;
    
    digitalOperation: number;

    analogDeadband: number;

    alarmThreshold: number;
}

export default LMSetupData;