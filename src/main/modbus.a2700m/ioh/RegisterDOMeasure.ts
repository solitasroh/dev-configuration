import A2700Data from "@src/Data/A2700Data"
import DigitalChannelData from "@src/Data/DigitalChannelData"
import ModbusService from "@src/main/ModbusService"
import { map, Observable } from "rxjs"
import RegisterBase from "../RegisterBase"
import RegisterProps from "../RegisterProps"

export default class RegisterDOMeasure extends RegisterBase {
    getter = (_params?: RegisterProps) : Observable<A2700Data|A2700Data[]> => {
        const { id } = _params;
        const address = 2357 + (id - 1) * 12;

        return ModbusService.read<boolean[]>(address, 6, {isCoil: true})
        .pipe(map(data => {
            const result: DigitalChannelData[] = [];
            for (let i = 0; i < 6; i+=1) {
                const measure = new DigitalChannelData();
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