import A2700Data from "@src/Data/A2700Data";
import ModbusRTU from "modbus-serial";
import { Observable } from "rxjs";
import IStuff from "./IStuff";

abstract class RegisterBase implements IStuff {

    protected client: ModbusRTU;

    constructor(client: ModbusRTU) {
        this.client = client;
    }

    abstract getter(): Observable<A2700Data> ;

    abstract setter(data: A2700Data) : Promise<boolean>;

    protected unlockSetup(): void
    {
        this.client.writeRegisters(51000, [2300, 0, 1, 700]);
    }
}

export default RegisterBase;