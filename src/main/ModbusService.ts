import ModbusRTU from 'modbus-serial';

import { catchError, forkJoin, from, map, Observable } from 'rxjs';
import ElectronStore from 'electron-store';
import { ReadRegisterResult } from 'modbus-serial/ModbusRTU';
import * as buffer from 'buffer';
import { sleep } from '@src/Utils';

export const ConnectionStatus = {
  NoConnect: 0,
  Connecting: 1,
  Connected: 2,
  Disconnecting: 3,
  Disconnected: 4,
};

export interface ModbusInitProps {
  onConnected: () => void;
  onClosed: () => void;
}

class ModbusService {
  private static instance: ModbusService;

  store: ElectronStore;

  protected ip: string;

  protected port: number;

  private connectionChecker: number;

  public connectionState: number;

  private prevConnectionState: number;

  private lock: boolean;

  static getIpAddress(): string {
    return this.instance.ip;
  }

  static getInstance(): ModbusService {
    if (this.instance == null) {
      this.instance = new ModbusService();
      this.instance.connectionChecker = 0;
    }
    return this.instance;
  }

  static modbusInit(): void {
    if (this.instance === null) {
      this.getInstance();
    }

    this.instance.store = new ElectronStore();
    const ipAddress = this.instance.store.get('ipAddress') as string;
    this.instance.client = new ModbusRTU();
    this.instance.client.setTimeout(1000);

    // reconnect to the device with the saved ip address.
    if (ipAddress !== undefined) {
      console.log(
        `$Modbus> reconnect to the device with the saved ip address. : ${ipAddress}`,
      );
      this.instance.ip = ipAddress;

      this.instance.connect(ipAddress, 502).then((connected) => {
        // nothing to do
        this.instance.checkConnection();
      });
    }
  }

  static modbusRelease(): void {
    this.instance.disconnect();

    this.instance.store = new ElectronStore();
    this.instance.store.set('ipAddress', this.instance.ip);
  }

  public isConnected(): boolean {
    return this.connectionState === ConnectionStatus.Connected;
  }

  checkConnection(): void {
    setInterval(async () => {
      if (this.connectionState === ConnectionStatus.Connected) {
        this.client
          .readHoldingRegisters(1, 1)
          .then()
          .catch(async (e) => {
            this.connectionState = ConnectionStatus.Disconnected;
          });
      } else if (this.connectionState === ConnectionStatus.Disconnected) {
        await this.connect(this.ip, this.port);
      }
    }, 1000);
  }

  private client: ModbusRTU;

  public async setConnectionInformation(
    ip: string,
    port = 502,
  ): Promise<boolean> {
    if (ip !== this.ip) {
      this.connectionState = ConnectionStatus.Disconnected;
      this.ip = ip;
      this.port = port;
      return false;
    }
    return true;
  }

  public async connect(ip: string, port = 502): Promise<boolean> {
    this.ip = ip;
    this.port = port;

    if (this.client === null || this.client === undefined) {
      this.client = new ModbusRTU();
    }

    try {
      if (this.connectionState === ConnectionStatus.Connecting) {
        console.log('request is failed cause the status is connecting');
        return false;
      }
      await this.disconnect();

      this.connectionState = ConnectionStatus.Connecting;

      await this.client.connectTCP(ip, { port });

      this.connectionState = ConnectionStatus.Connected;

      console.log('modbus> connect to device :', ip);
      return true;
    } catch (error) {
      console.log('modbus> connection failed :', ip);
      this.connectionState = ConnectionStatus.Disconnected;
      return false;
    }
  }

  public disconnect(): Promise<void> {
    this.connectionState = ConnectionStatus.Disconnecting;
    return new Promise((resolve, reject) => {
      if (this.client !== null) {
        if (!this.client.isOpen) {
          console.log('modbus> closed connection : client is not opened');
          this.connectionState = ConnectionStatus.Disconnected;
          resolve();
          return;
        }

        this.client.close(() => {
          console.log('modbus> closed connection');
          this.connectionState = ConnectionStatus.Disconnected;
          resolve();
        });
      } else {
        console.log('modbus> closed connection : client is null');
        this.connectionState = ConnectionStatus.Disconnected;
        resolve();
      }
    });
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
      if (length > 125) {
        let remaining = length;
        let readLen = 0;
        let len = 125;
        let offset = address;
        const ob: Observable<ReadRegisterResult>[] = [];

        while (len > 0) {
          const observable = from(
            this.GetClient().readHoldingRegisters(offset - 1, len),
          );
          offset += len;
          remaining = remaining - len;
          len = remaining > 125 ? 125 : remaining;
          ob.push(observable);
        }

        return forkJoin([...ob]).pipe(
          map((resp) => {
            const data = resp.map((v) => v.data || v.buffer);
            return data.reduce((prev, curr) => {
              return [...prev, ...curr];
            });
          }),
          catchError((e) => {
            console.log(`[error]modbus multi read address: ${address}`, e);
            return [];
          }),
        );
      }

      return from(
        this.GetClient().readHoldingRegisters(address - 1, length),
      ).pipe(
        map((value) => value.data || value.buffer),
        catchError((e) => {
          console.log(`[error] modbus read address: ${address}`, e);
          return [];
        }),
      );
    }
    return from(this.GetClient().readCoils(address - 1, length)).pipe(
      map((value) =>
        // console.log(
        //   `modbus coil read length :  ${length}, data length: ${value.data.length}`,
        // );
        value.data.slice(0, length + 1),
      ),
      catchError((e) => {
        console.log(`[error] modbus coil address: ${address}`, e);
        return [];
      }),
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
      catchError((error) => {
        console.log(error);
        return [];
      }),
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
