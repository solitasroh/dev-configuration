import { sleep } from '@src/Utils';
import ModbusRTU from 'modbus-serial';

import { catchError, from, map, Observable } from 'rxjs';

class ModbusService {
  private static instance: ModbusService;

  protected ip: string;

  protected port: number;

  private connectionChecker: number;

  static getInstance(): ModbusService {
    if (this.instance == null) {
      this.instance = new ModbusService();
      this.instance.connectionChecker = 0;
    }
    return this.instance;
  }

  public isConnected(): boolean {
    return this.client !== null ? this.client.isOpen : false;
  }

  check() {
    setInterval(() => {
      if (this.client.isOpen) {
        this.client
          .readHoldingRegisters(1, 1)
          .then()
          .catch((e) => {
            this.connectionChecker += 1;
          });
      }
    }, 1000);
  }

  async checkConnection(): Promise<boolean> {
    if (this.client.isOpen) {
      try {
        await this.client.readHoldingRegisters(1, 1);
        return true;
      } catch (error) {
        // retry connection
        this.connectionChecker += 1;
        if (this.connectionChecker === 10) {
          const reconnected = await this.connect(this.ip);
          console.log('connection failed(exception), retry = ', reconnected);
          this.connectionChecker = 0;
          return true;
        }
        return false;
      }
    } else {
      try {
        this.client.setTimeout(100);
        const reconnected = await this.connect(this.ip);
        console.log(
          `[${this.ip}]connection failed(closed), retry = ${reconnected}`,
        );
        return reconnected;
      } catch (error) {
        return false;
      }
    }
  }

  private client: ModbusRTU;

  public async connect(ip: string, port = 502): Promise<boolean> {
    this.ip = ip;
    this.port = port;

    try {
      if (this.client === null) {
        this.client = new ModbusRTU();
      }
      this.client.close(() => {
        console.log('close');
      });
      this.client
        .connectTCP(ip, { port })
        .then(() => {
          console.log(`connected to ${ip}:${port}`);
        })
        .catch((err) => {
          console.log(`Connection failed ${ip}:${port}`);
        });
      return true;
    } catch (err) {
      return false;
    }
  }

  public disconnect(): void {
    try {
      if (this.client !== null) {
        this.client.close(() => console.log('close'));
      }
    } catch (error) {
      console.log(`disconnect error : ${error}`);
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
        catchError((e) =>
          // console.log(e);
          [],
        ),
      );
    }
    return from(this.GetClient().readCoils(address - 1, length)).pipe(
      map((value) =>
        // console.log(
        //   `modbus coil read length :  ${length}, data length: ${value.data.length}`,
        // );
        value.data.slice(0, length + 1),
      ),
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
        catchError((e) =>
          // console.log(e);
          [],
        ),
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
      catchError((error) =>
        // console.log(error);
        [],
      ),
    );
  }

  static writeCoils(address: number, data: boolean[]): Observable<number> {
    return from(this.GetClient().writeCoils(address - 1, data)).pipe(
      map((result) => result.address),
      catchError((error) =>
        // console.log(error);
        [],
      ),
    );
  }
}

export default ModbusService;
