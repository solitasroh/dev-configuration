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
        map((value) => value.data || value.buffer),
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

  static readBuffer(
    address: number,
    length: number,
    options?: { isCoil?: boolean },
  ): Observable<Buffer> {
    if (options === undefined) {
      return from(
        this.GetClient().readHoldingRegisters(address - 1, length),
      ).pipe(
        map((value) => value.buffer),
        catchError((e) => {
          console.log(e);
          return [];
        }),
      );
    }
    return from(this.GetClient().readCoils(address - 1, length)).pipe(
      map((value) => value.buffer),
      catchError(() => []),
    );
  }

  static write(address: number, data: number[]): Observable<number | string> {
    const register = data as number[];
    return from(this.GetClient().writeRegisters(address - 1, register)).pipe(
      map((result) => result.address),
      catchError((error) => {
        console.log(error);
        return [];
      }),
    );
  }

  static writeCoils(address: number, data: boolean[]): Observable<number> {
    return from(this.GetClient().writeCoils(address, data)).pipe(
      map((result) => result.address),
      catchError((error) => {
        console.log(error);
        return [];
      }),
    );
  }
}

export default ModbusService;
