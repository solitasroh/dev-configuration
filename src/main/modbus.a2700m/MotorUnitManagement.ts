import { WebContents } from 'electron';

import ModbusRTU from "modbus-serial";
import ModbusService from "../ModbusService";

export default class MotorUnitManagement  {
    
    private static instance: MotorUnitManagement;

    static getInstance(): MotorUnitManagement {
      if (this.instance == null) {
        this.instance = new MotorUnitManagement();
      }
      return this.instance;
    }

    private client : ModbusRTU;
    
    private moduleOperationStates: boolean[] ;

    private constructor() {
        this.moduleOperationStates = Array.from({length: 40}, () => false);
    }

    start(wc: WebContents) : void{
        this.client = ModbusService.GetClient();
        let forceChangeTime = 0;
        setInterval(async () => {
            const data = this.moduleOperationStates.map((ret, index) => this.readOperationState(index + 1));
            
            Promise.all(data).then(result => {
                let changed = false;
                this.moduleOperationStates.forEach((value, index, a) => {
                    if (result[index] !== value) {
                        changed = true;
                    }
                })

                if (changed || forceChangeTime === 5) {
                    forceChangeTime = 0;
                    wc.send("PC_STATUS_CHAGNED", result);
                }

                this.moduleOperationStates = result;
                // console.log("get state promise : ",this.moduleOperationStates);
            });
            forceChangeTime += 1;
        }, 500);
    }

    getStatus() : boolean[] {
        return this.moduleOperationStates;
    }

    async readOperationState(id: number) : Promise<boolean> {
        if (this.client.isOpen) {
            try {
                const address = 10001 + (id - 1) * 700;
                const result = await this.client.readHoldingRegisters(address-1, 1);
                return result.data[0] === 4;
            } catch(error) {
                return false;
            }
        }
        return false;
    }
}