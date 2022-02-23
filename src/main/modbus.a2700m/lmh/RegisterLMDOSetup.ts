import RegisterBase from "@src/main/modbus.a2700m/RegisterBase";
import RegisterProps from "@src/main/modbus.a2700m/RegisterProps";
import { forkJoin, map, Observable } from "rxjs";
import A2700Data from "@src/Data/A2700Data";
import ModbusService from "@src/main/ModbusService";
import LMHLogicSetup from "@src/Data/LMHLogicSetup";

export default class RegisterLMDOSetup extends RegisterBase {
  private accessAddress = 61881;

  private dataAddress = 61900;

  getter(_params?: RegisterProps): Observable<A2700Data | A2700Data[]> {
    const size = 9;
    const access = ModbusService.read<number[]>(this.accessAddress, 1);
    const data = ModbusService.read<number[]>(this.dataAddress, size);

    return forkJoin([access, data]).pipe(
      map((d) => {
        const [acc, buffer] = d;
        const setup = new LMHLogicSetup(size);
        if (acc[0] === 0x8000) {
          for (let i = 0; i < size; i += 1) {
            setup.detail[i].mapping = buffer[i];
          }
        }
        return setup;
      })
    );
  }

  setter(_data: LMHLogicSetup): void {
    this.unlockSetup();
    const size = 9;
    const buffer = [];

    for (let i = 0; i < size; i += 1) {
      buffer.push(_data.detail[i].mapping);
    }

    ModbusService.write(this.dataAddress, buffer).subscribe();
    ModbusService.write(this.accessAddress, [1]).subscribe();
  }
}