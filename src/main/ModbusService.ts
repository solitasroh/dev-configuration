import ModbusRTU from 'modbus-serial';
import {
  catchError,
  from,
  interval,
  map,
  mergeMap,
  of,
  takeUntil,
  timeout,
} from 'rxjs';

class ModbusService {
  private static instance: ModbusService;

  protected ip: string;

  protected port: number;

  static getInstance(): ModbusService {
    if (this.instance == null) {
      this.instance = new ModbusService();
    }
    return this.instance;
  }

  private client: ModbusRTU;

  async connect(ip: string, port = 502): Promise<void> {
    this.ip = ip;
    this.port = port;
    try {
      await this.client.connectTCP(ip, { port });
    } catch (error) {
      console.log(error);
    }

    this.maintainConnection();
  }

  static GetClient(): ModbusRTU {
    if (this.instance.client == null) {
      this.instance.client = new ModbusRTU();
    }

    return this.instance.client;
  }

  private maintainConnection(): void {
    const readFail = from(this.client.readHoldingRegisters(1, 1)).pipe(
      catchError(() => of(true)),
    );
    const fetch = interval(3000).pipe(
      takeUntil(readFail),
      mergeMap(() =>
        from(this.client.readHoldingRegisters(1, 1)).pipe(
          catchError(() => of(false)),
        ),
      ),
    );

    fetch.subscribe((res) => {
      if (res === false) {
        this.connect(this.ip, this.port);
      }
    });
  }
}

export default ModbusService;
