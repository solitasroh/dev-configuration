import * as modbus from 'modbus.ts';

import LMSetupData from '../../Data/A2700.LMSetup';
import A2700DataType from '../../Data/A2700DATA_TYPE';
import A2700Data from '../../Data/A2700Data';

interface RegisterSetup {
    address: number,
    length: number,
    access: number,
    getter: () => void;
    setter: () => void;
}


class ModbusService {
    private Client: modbus.tcp.Client;

    constructor(client: modbus.tcp.Client) {
        this.Client = client;    
    }
    
     RequestA2700Data(data: A2700DataType): A2700Data {
        if (data === A2700DataType.LMSetup) {
            this.Client.readHoldingRegisters(64010, 7)
            .pipe(res => {
                
            });
        }
        return null;
    }
}

export default A2750LMSetup;
