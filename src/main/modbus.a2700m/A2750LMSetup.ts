import LMSetupData from "@src/Data/A2700.LMSetup";
import A2700Data from "@src/Data/A2700Data";
import { from, map, Observable } from "rxjs";
import RegisterBase from "./RegisterBase";

export default class A2750LMSetupReg extends RegisterBase {

  async setter(data: A2700Data): Promise<boolean> {

    if (data instanceof LMSetupData) {
      const buf = [
        data.operationMode,
        data.digitalOperation,
        data.alarmThreshold,
        data.analogDeadband
      ];
      
      this.unlockSetup();

      try { 
        await this.client.writeRegisters(64011, buf);
        await this.client.writeRegister(64010, 1);
        return true;
      } catch (error) {
        return false;
      }
    }
    
    return false;
  }

  getter(): Observable<A2700Data> {
        return from(this.client.readHoldingRegisters(64010, 5))
        .pipe(
            map((res) => {
              const result = new LMSetupData();
  
              const [
                access,           // 64010
                operationMode,    // 64011
                digitalOperation, // 64012
                alarmThreshold,   // 64013
                analogDeadband,   // 64014
              ] = res.data as number[];
  
              result.access = access;
              result.operationMode = operationMode;
              result.digitalOperation = digitalOperation;
              result.alarmThreshold = alarmThreshold;
              result.analogDeadband = analogDeadband;
  
              return result;
          }),
        );
    }
}


