/**
 * Copyright reelyActive 2022-2025
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

  // Reference: EPC Tag Data Standard TDS v2.3 Section 14.2
  switch(header) {
    case 0x2c:
      return null; // TODO: GDTI-96
    case 0x2d:
      return null; // TODO: GSRN-96
    case 0x2e:
      return null; // TODO: GSRNP-96
    case 0x2f:
      return null; // TODO: USDoD-96
    case 0x30:
      return processSGTIN96(buf);
    case 0x31:
      return null; // TODO: SSCC-96
    case 0x32:
      return null; // TODO: SGLN-96
    case 0x33:
      return null; // TODO: GRAI-96
    case 0x34:
      return null; // TODO: GIAI-96
    case 0x35:
      return null; // TODO: GID-96
    case 0x3c:
      return null; // TODO: CPI-96
    case 0x3f:
      return null; // TODO: SGCN-96
    case 0xe2:
      return processSTID(buf);
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
      components = utils.decodeComponents(data.subarray(1),
                      [ 6, 46, 50 ], [ 'dec', 'dec', 'dec' ], [ 12, 1, null ]);
      break;
    case 1:
      components = utils.decodeComponents(data.subarray(1),
                      [ 6, 43, 50 ], [ 'dec', 'dec', 'dec' ], [ 11, 2, null ]);
      break;
    case 2:
      components = utils.decodeComponents(data.subarray(1),
                      [ 6, 40, 50 ], [ 'dec', 'dec', 'dec' ], [ 10, 3, null ]);
      break;
    case 3:
      components = utils.decodeComponents(data.subarray(1),
                      [ 6, 36, 50 ], [ 'dec', 'dec', 'dec' ], [ 9, 4, null ]);
      break;
    case 4:
      components = utils.decodeComponents(data.subarray(1),
                      [ 6, 33, 50 ], [ 'dec', 'dec', 'dec' ], [ 8, 5, null ]);
      break;
    case 5:
      components = utils.decodeComponents(data.subarray(1),
                      [ 6, 30, 50 ], [ 'dec', 'dec', 'dec' ], [ 7, 6, null ]);
      break;
    case 6:
      components = utils.decodeComponents(data.subarray(1),
                      [ 6, 26, 50 ], [ 'dec', 'dec', 'dec' ], [ 6, 7, null ]);
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


/**
 * Process a STID EPC.
 * Reference: EPC Tag Data Standard TDS v2.3 Section 16.3.2
 * @param {Buffer} data The EPC as a Buffer.
 * @return {Object} The processed EPC as JSON.
 */
function processSTID(data) {
  if(data.length < 5) {
    return null;
  }

  let isTdsCompliantXtid = (data.readUInt8(1) & 0x80) === 0x80;
  if(!isTdsCompliantXtid) {
    return null;
  }

  let uri = 'urn:epc:stid:x';
  let components = utils.decodeComponents(data.subarray(1),
                                          [ 0, 12, 24, 27, 40 ],
                                          [ 'hex', 'hex', 'dec', 'hex', 'hex' ],
                                          [ 3, 3, 1, null, null ]);

  uri += components[0] + '.x' + components[1] + '.x';
  let v = parseInt(components[2]);

  if(v === 0) {
    return null;
  }

  // TODO: confirm calculation of L
  let l = 4 + 16 * (v - 1);

  if(((data.length * 8) === (l + 48)) && (components[4] !== null)) {
    uri += components[4].toUpperCase();
  }
  else {
    return null;
  }

  return { uri: uri + components[4] };
}


module.exports.processEPC = processEPC;
