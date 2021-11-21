import A2700Data from "@src/Data/A2700Data"
import AIMeasure from "@src/Data/AIMeasure"
import ModbusService from "@src/main/ModbusService"
import { map, Observable } from "rxjs"
import RegisterBase from "../RegisterBase"
import RegisterProps from "../RegisterProps"

export default class RegisterAIMeausre extends RegisterBase {
    getter = (_params?: RegisterProps) : Observable<A2700Data|A2700Data[]> => {
        const { id } = _params;
        const address = 63271 + (id - 1) * 24;
        return ModbusService.readBuffer(address, 24)
        .pipe(map(data => {
            const result: AIMeasure[] = [];
            for (let i = 0; i < 12; i+=1) {
                const measure = new AIMeasure();
                measure.ch = i+1;
                measure.data = data.readFloatBE(i);
                result.push(measure);
            }
            return result;
        }));
    }

    setter = (_data: A2700Data) : void => {
        console.log("empty setter");
    }
}