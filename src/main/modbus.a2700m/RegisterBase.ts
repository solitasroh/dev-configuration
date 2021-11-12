import A2700Data from "@src/Data/A2700Data";
import { Observable } from "rxjs";
import ModbusService from "../ModbusService";
import IStuff from "./IStuff";

abstract class RegisterBase implements IStuff {

    abstract getter(): Observable<A2700Data> ;

    abstract setter(data: A2700Data) : void;

    unlockSetup = (): void => 
    {
        ModbusService.write(51000, [2300, 0, 1, 700]).subscribe(r => console.log(r));
    }
}

export default RegisterBase;