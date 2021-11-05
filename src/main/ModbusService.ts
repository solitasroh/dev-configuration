import LMSetupData from '@src/Data/A2700.LMSetup';
import A2700DataType from '@src/Data/A2700DataType';
import * as modbusTs from 'modbus.ts';
import A2700Register from './modbus.a2700m/A2700M.Register';

class ModbusService {
  private static instance: ModbusService;

  static getInstance(): ModbusService {
    if (this.instance == null) {
      this.instance = new ModbusService();
    }
    return this.instance;
  }

  private client: modbusTs.tcp.Client;

  start(ip: string, port = 502): void {
    if (this.client != null) {
      this.client.destroy();
    }

    this.client = new modbusTs.tcp.Client({ host: ip, port });

    this.client.connect().subscribe({
      next: () => {
        const register = new A2700Register(this.client);

        register.Request(A2700DataType.LMSetup).subscribe((res) => {
          if (res instanceof LMSetupData) {
            console.log(res);
          }
        });
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete'),
    });
  }

  static GetClient(): modbusTs.tcp.Client {
    return this.instance.client;
  }
}

export default ModbusService;
