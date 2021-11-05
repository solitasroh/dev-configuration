import { ModbusCommandException, ModbusTcp } from 'simple-modbus'

class A2700MRegister {
    private server: ModbusTcp.Server;

    constructor(server:ModbusTcp.Server) {
        this.server = server;    
    }

    
}

export default A2700MRegister;
