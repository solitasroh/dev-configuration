import ModbusRTU from 'modbus-serial';

import {
  catchError,
  from,
  map,
  Observable,
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

  public async connect(ip: string, port = 502): Promise<boolean> {
    this.ip = ip;
    this.port = port;
    
    try {
      this.client = new ModbusRTU();
      await this.client.connectTCP(ip, { port });
      return true;
    } catch(err) {
      return false;
    }
  }

  static GetClient(): ModbusRTU {
    if (this.instance.client == null) {
      this.instance.client = new ModbusRTU();
    }

    return this.instance.client;
  }

  static read(
    address: number,
    length: number,
    options?: { isCoil?: boolean },
  ): Observable<number[] | boolean[] | string> {
    if (options === undefined) {
      return from(this.GetClient().readHoldingRegisters(address, length)).pipe(
        map((value) => value.data),
        catchError(() => []),
      );
    }
    return from(this.GetClient().readCoils(address, length)).pipe(
      map((value) => value.data),
      catchError(() => []),
    );
  }

  static write(
    address: number,
    data: number[] | boolean[],
  ): Observable<number | string> {
    if (data as boolean[]) {
      const coil = data as boolean[];
      return from(this.GetClient().writeCoils(address, coil)).pipe(
        map((result) => result.address),
        catchError(() => []),
      );
    }
    const register = data as number[];
    return from(this.GetClient().writeRegisters(address, register)).pipe(
      map((result) => result.address),
      catchError(() => []),
    );
  }
}

export default ModbusService;
