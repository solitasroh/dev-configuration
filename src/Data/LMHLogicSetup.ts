import A2700Data from "./A2700Data";
import A2700DataType from "./A2700DataType";

export default class LMHLogicSetup implements A2700Data{
    type : A2700DataType = A2700DataType.LMHLogicSetup;

    access: number;

    diMappingPolarity : number;

    doMapping : number; 
}