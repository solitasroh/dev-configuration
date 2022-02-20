export interface SetupDef {
  key: number;
  setupParameter: string;
  defaultValue: number;
  setupEnum?: string[];
  address: number;
  dataType: string;
  dataSize: number;
  dataRange: number[];
  comment: string;
}
