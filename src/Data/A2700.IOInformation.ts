import A2700Data from './A2700Data';
import A2700DataType from './A2700DataType';

class IOInformation implements A2700Data {
  type: A2700DataType = A2700DataType.LMInfo;
  
  id: number;

  operationStatus: string;

  productCode: string;

  serialNumber: string;

  hardwareRevision: number;

  pcbVersion: number;

  applicationVersion: string;

  bootloaderVersion: string;

  moduleType : string;

  setOperationState(operationStatus: number): void {
    if (operationStatus === 0) this.operationStatus = 'UNINDENTIFIED';
    if (operationStatus === 1) this.operationStatus = 'ID conflict';
    if (operationStatus === 2) this.operationStatus = 'BOOTING';
    if (operationStatus === 3) this.operationStatus = 'OPERATING';
  }

  setModuleType (type: number) : void {
    if (type === 5) this.moduleType = 'DIO';
    if (type === 8) this.moduleType = "AI2";
  }

  setProductCode(...productCode: number[]): void {
    this.productCode = String.fromCharCode(...productCode);
  }

  setSerialNumber(serialNumber: number): void {
    this.serialNumber = IOInformation.fillZero(6, serialNumber.toString());
  }

  static getAppVersion(version: number): string {
    const main = Math.floor(version / 10000);
    const sub = Math.floor((version - main * 10000) / 1000);
    const fixed = version - main * 10000 - sub * 1000;
    return `${main}.${sub}.${IOInformation.fillZero(3, fixed.toString())}`;
  }

  static fillZero(width: number, str: string): string {
    return str.length >= width
      ? str
      : new Array(width - str.length + 1).join('0') + str;
  }

  
}

export default IOInformation;
