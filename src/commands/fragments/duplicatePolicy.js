const QuerySchema = require('../../QuerySchema');

const DuplicatePolicy = {
  BLOCK: 'BLOCK', // - an error will occur for any out of order sample
  FIRST: 'FIRST', // - ignore the new value
  LAST: 'LAST', // - override with latest value
  MIN: 'MIN', // - only override if the value is lower than the existing value
  MAX: 'MAX', // - only override if the value is higher than the existing value
  SUM: 'SUM' // - add the new sample to it so that the updated value is equal to (previous + new)
};

const DuplicatePolicyTypes = Object.values(DuplicatePolicy);

const DUPLICATE_POLICY = 'DUPLICATE_POLICY';
const METHOD_NAME = 'duplicatePolicy';

/**
 * DUPLICATE_POLICY duplicatePolicy
 */
module.exports = QuerySchema
  .create(DUPLICATE_POLICY)
  .methodName(METHOD_NAME)
  .exports({ DuplicatePolicy })
  .param(
    'duplicatePolicy',
    (value) => DuplicatePolicyTypes.includes(value)
  );


DuplicatePolicy.BLOCK
DuplicatePolicy.FIRST
DuplicatePolicy.LAST
DuplicatePolicy.MIN
DuplicatePolicy.MAX
DuplicatePolicy.SUM