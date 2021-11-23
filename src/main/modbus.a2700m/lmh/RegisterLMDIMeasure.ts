import A2700Data from "@src/Data/A2700Data"
import LMDIData from "@src/Data/LMDIData"
import ModbusService from "@src/main/ModbusService"
import { map, Observable } from "rxjs"
import RegisterBase from "../RegisterBase"
import RegisterProps from "../RegisterProps"

export default class RegisterAIMeausre extends RegisterBase {
    getter = (_params?: RegisterProps) : Observable<A2700Data|A2700Data[]> => {
        const address = 2000 ;       

        return ModbusService.read<boolean[]>(address, 18, {isCoil: true})
        .pipe(map(data => {
            const result: LMDIData[] = [];
            for (let i = 0; i < 18; i+=1) {
                const measure = new LMDIData();
                measure.channel = i+1;
                measure.value = data[i];    // boolean 이어야 함
                result.push(measure);
            }
            return result;
        }));
    }

    setter = (_data: A2700Data) : void => {
        console.log("empty setter");
    }
}