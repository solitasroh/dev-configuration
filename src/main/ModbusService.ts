import ModbusRTU from 'modbus-serial';

import { catchError, from, map, Observable } from 'rxjs';

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
    } catch (err) {
      return false;
    }
  }

  static GetClient(): ModbusRTU {
    if (this.instance.client == null) {
      this.instance.client = new ModbusRTU();
    }

    return this.instance.client;
  }

  static read<T>(
    address: number,
    length: number,
    options?: { isCoil?: boolean },
  ): Observable<T> {
    if (options === undefined) {
      return from(
        this.GetClient().readHoldingRegisters(address - 1, length),
      ).pipe(
        map((value) => value.data),
        catchError((e) => {
          console.log(e);
          return [];
        }),
      );
    }
    return from(this.GetClient().readCoils(address - 1, length)).pipe(
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
      return from(this.GetClient().writeCoils(address - 1, coil)).pipe(
        map((result) => result.address),
        catchError(() => []),
      );
    }
    const register = data as number[];
    return from(this.GetClient().writeRegisters(address - 1, register)).pipe(
      map((result) => result.address),
      catchError(() => []),
    );
  }
}

export default ModbusService;
