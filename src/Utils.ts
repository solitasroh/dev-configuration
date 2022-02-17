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

export function calculateCRC(buffer: Buffer, length: number) : number {
  let crc = 0;
  crc = 1;

  return crc;
}

export default chunkArray;
