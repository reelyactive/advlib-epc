/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const utils = require('./utils');


const MIN_EPC_LENGTH_BYTES = 12;
const COMPONENT_SEPARATOR = '.';


/**
 * Process Electronic Product Code binary data.
 * @param {Object} data The EPC as a hexadecimal-string or Buffer.
 * @return {Object} The processed EPC URI as JSON.
 */
function processEPC(data) {
  let buf = utils.convertToBuffer(data);

  if((buf === null) || (buf.length < MIN_EPC_LENGTH_BYTES)) {
    return null;
  }

  let header = buf.readUInt8();

  switch(header) {
    case 0x30:
      return processSGTIN96(buf);
    default:
      return null;
  }
}


/**
 * Process a SGTIN-96 EPC.
 * @param {Buffer} data The EPC as a Buffer.
 * @return {Object} The processed EPC as JSON.
 */
function processSGTIN96(data) {
  if(data.length !== 12) {
    return null;
  }

  let filter = data.readUInt8(1) >> 5;
  let partition = (data.readUInt8(1) >> 2) & 0x07;
  let components;

  // See SGTIN Partition Table in EPC Tag Data Standard
  switch(partition) {
    case 0:
      components = utils.decodeComponents(data.subarray(1), [ 6, 46, 50 ],
                                                            [ 12, 1, null ]);
      break;
    case 1:
      components = utils.decodeComponents(data.subarray(1), [ 6, 43, 50 ],
                                                            [ 11, 2, null ]);
      break;
    case 2:
      components = utils.decodeComponents(data.subarray(1), [ 6, 40, 50 ],
                                                            [ 10, 3, null ]);
      break;
    case 3:
      components = utils.decodeComponents(data.subarray(1), [ 6, 36, 50 ],
                                                            [ 9, 4, null ]);
      break;
    case 4:
      components = utils.decodeComponents(data.subarray(1), [ 6, 33, 50 ],
                                                            [ 8, 5, null ]);
      break;
    case 5:
      components = utils.decodeComponents(data.subarray(1), [ 6, 30, 50 ],
                                                            [ 7, 6, null ]);
      break;
    case 6:
      components = utils.decodeComponents(data.subarray(1), [ 6, 26, 50 ],
                                                            [ 6, 7, null ]);
      break;
    default:
      return null;
  }

  let uri = 'urn:epc:tag:sgtin-96:' +
            components[0] + COMPONENT_SEPARATOR + // Company Prefix
            components[1] + COMPONENT_SEPARATOR + // Indicator
            components[2];                        // Serial

  return { uri: uri };
}


module.exports.processEPC = processEPC;
