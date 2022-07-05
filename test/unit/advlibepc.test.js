/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const advlib = require('../../lib/advlibepc.js');
const assert = require ('assert');


// Input data for the scenario
const INPUT_DATA_INVALID_EPC = '0123';
const INPUT_DATA_SGTIN_96 = '3074257bf7194e4000001a85';



// Expected outputs for the scenario
const EXPECTED_DATA_INVALID_INPUT = null;
const EXPECTED_DATA_SGTIN_96 = {
    uri: "urn:epc:tag:sgtin-96:3.0614141.812345.6789"
}


// Describe the scenario
describe('advlib-epc', function() {

  // Test the process function with no input data
  it('should handle no input data', function() {
    assert.deepEqual(advlib.processEPC(), EXPECTED_DATA_INVALID_INPUT);
  });

  // Test the process function with an invalid EPC
  it('should handle an invalid EPC as input', function() {
    assert.deepEqual(advlib.processEPC(INPUT_DATA_INVALID_EPC),
                     EXPECTED_DATA_INVALID_INPUT);
  });

  // Test the process function with a valid SGTIN-96
  it('should handle valid SGTIN-96 data as input', function() {
    assert.deepEqual(advlib.processEPC(INPUT_DATA_SGTIN_96),
                     EXPECTED_DATA_SGTIN_96);
  });

});
