/**
 * Copyright reelyActive 2015-2022
 * We believe in an open Internet of Things
 */


const PADDING_DIGIT = '0';


/**
 * Convert the given hexadecimal string or Buffer to a Buffer.
 * @param {Object} data A hexadecimal-string or Buffer.
 * @return {Object} The data as a Buffer, or null if invalid data format.
 */
function convertToBuffer(data) {
  if(Buffer.isBuffer(data)) {
    return data;
  }

  if(typeof data === 'string') {
    data = data.toLowerCase();
    let isHex = /[0-9a-f]+/.test(data);
    if(isHex) {
      return Buffer.from(data, 'hex');
    }
  }

  return null;
}


/**
 * Convert the given Buffer into components divided on the given bit offsets
 * and represented as strings with the given number of digits.
 * @param {Object} data A hexadecimal-string or Buffer.
 * @return {Object} The data as a Buffer, or null if invalid data format.
 */
function decodeComponents(data, bitOffsets, numberOfDigits) {
  let lengthInBits = data.length * 8;
  let partitions = [];

  if(!Array.isArray(bitOffsets) ||
     (Array.isArray(numberOfDigits) &&
                               (bitOffsets.length != numberOfDigits.length))) {
    return null;
  }

  bitOffsets.forEach((bitOffset, index) => {
    let isLastOffset = (index === (bitOffsets.length - 1));
    let nextBitOffset = lengthInBits;
    if(!isLastOffset) {
      nextBitOffset = bitOffsets[index + 1];
    }
    let partitionLengthInBits = nextBitOffset - bitOffset;
    let byteOffset = Math.floor(bitOffset / 8);
    let bytesSpanned = Math.ceil(((bitOffset % 8) + partitionLengthInBits) / 8);
    let bitsToShiftRight = (8 - (bitOffset + partitionLengthInBits) % 8) % 8;
    let isFixedNumberOfDigits = Array.isArray(numberOfDigits) &&
                                Number.isInteger(numberOfDigits[index]);
    let partition;

    if(bytesSpanned <= 6) {
      partition = ((data.readUIntBE(byteOffset, bytesSpanned) >>>
                    bitsToShiftRight) %
                                 Math.pow(2, partitionLengthInBits)).toString();
    }
    else {
      // TODO: handle Integer manipulations over 48-bits
      partition = '0';
    }

    if(isFixedNumberOfDigits) {
      partition = partition.padStart(numberOfDigits[index], PADDING_DIGIT);
    }

    partitions.push(partition);
  });

  return partitions;
}


module.exports.convertToBuffer = convertToBuffer;
module.exports.decodeComponents = decodeComponents;
