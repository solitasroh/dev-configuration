import ModbusRTU from 'modbus-serial';

class ModbusService {
  private static instance: ModbusService;

  static getInstance(): ModbusService {
    if (this.instance == null) {
      this.instance = new ModbusService();
    }
    return this.instance;
  }

  private client: ModbusRTU;

  async start(ip: string, port = 502): Promise<void> {
    this.client = new ModbusRTU();

    await this.client.connectTCP(ip, { port });
  }

  static GetClient(): ModbusRTU {
    return this.instance.client;
  }
}

export default ModbusService;
