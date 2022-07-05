/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const utils = require('./utils');


const MIN_EPC_LENGTH_BYTES = 12;


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
  }

  return null;
}


/**
 * Process a SGTIN-96 EPC.
 * @param {Buffer} data The EPC as a Buffer.
 * @return {Object} The processed EPC URI as JSON.
 */
function processSGTIN96(data) {
  // TODO: test data length

  let uri = 'urn:epc:tag:sgtin-96:';
  let leadByte = data.readUInt8(1);
  let filter = leadByte >> 5;
  let partition = (leadByte >> 2) & 0x07;
  let partitionTable = ((leadByte & 0x03) << 42) + (data.readUIntBE(2, 6) / 64);

  let serial = data.readUIntBE(7, 5) & 0x3fffffffff
  let companyPrefix;
  let indicator;

  switch(partition) {
    case 0:
      companyPrefix = data.readUIntBE(1, 6) >> 0;
      break;
    case 5:
      companyPrefix = Math.floor(partitionTable / 1048576);
      indicator = partitionTable & 0xfffff;
      break;
  }

  uri += filter + '.' + companyPrefix + '.' + indicator + '.' + serial;

  return { uri: uri };
}


module.exports.processEPC = processEPC;
