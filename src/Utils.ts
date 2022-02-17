/* eslint-disable no-bitwise */
/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 */
function chunkArray(myArray: any, chunkSize: number): Array<any> {
  if (!(myArray instanceof Array)) {
    return null;
  }

  const results = [];
  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize));
  }

  return results;
}
const crcTable = [256];

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function calculateCRC(buffer: Uint8Array, length: number): number {
  let uchCRCHi = 0xff;
  let uchCRCLo = 0xff;
  let crcIndex;
  let index;

  console.log(`buffer size = ${buffer.byteLength}`);
  let count = 0;
  for (index = 0; index < length; index += 1) {
    if (buffer[index] !== undefined) {
      count += 1;
      //    console.log(buffer[index]);
    }

    crcIndex = uchCRCHi ^ buffer[index];
    uchCRCHi = uchCRCLo ^ (crcTable[crcIndex] & 0xff);
    uchCRCLo = (crcTable[crcIndex] >> 8) & 0xff;
  }
  console.log('crc count ', count);
  return (uchCRCHi << 8) | uchCRCLo;
}

function initCrc(): void {
  let c;

  const genCrc = (data: number, polynomial: number): number => {
    let crc;
    let d = data;

    for (crc = 0, c = 0; c < 8; c += 1) {
      if (((d ^ crc) & 1) !== 0) {
        crc = (crc >> 1) ^ polynomial;
      } else {
        crc >>= 1;
      }
      d >>= 1;
    }
    return crc & 0xffff;
  };

  for (let i = 0; i < 256; i += 1) {
    crcTable[i] = genCrc(i, 0xa001);
  }
}

initCrc();

export default chunkArray;
