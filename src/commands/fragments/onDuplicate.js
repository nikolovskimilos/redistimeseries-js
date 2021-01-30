const QuerySchema = require('../../QuerySchema');

const OnDuplicate = {
  BLOCK: 'BLOCK', // - an error will occur for any out of order sample
  FIRST: 'FIRST', // - ignore the new value
  LAST: 'LAST', // - override with latest value
  MIN: 'MIN', // - only override if the value is lower than the existing value
  MAX: 'MAX', // - only override if the value is higher than the existing value
  SUM: 'SUM' // - add the new sample to it so that the updated value is equal to (previous + new)
};

const DuplicatePolicyTypes = Object.values(OnDuplicate);

const ON_DUPLICATE = 'ON_DUPLICATE';
const METHOD_NAME = 'onDuplicate';

/**
 * ON_DUPLICATE duplicatePolicy
 */
module.exports = QuerySchema
  .create(ON_DUPLICATE)
  .methodName(METHOD_NAME)
  .exports({ OnDuplicate })
  .param(
    'duplicatePolicy',
    (value) => DuplicatePolicyTypes.includes(value)
  );
