import A2700Data from "./A2700Data";
import A2700DataType from "./A2700DataType";

export default class A2750PCStatus implements A2700Data
{
    type: A2700DataType;

    startingBlock : boolean;

    motorOperationState: boolean;

    remoteStatus: boolean;

    abnormalState: boolean;

    alarmState: boolean;

    faultState: boolean;
}