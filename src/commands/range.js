const QuerySchema = require('../QuerySchema');
const { Validator } = require('./utils');
const { count, aggregation } = require('./fragments');

const TS_RANGE = 'TS.RANGE';

/**
 * TS.RANGE key fromTimestamp toTimestamp [COUNT count] [AGGREGATION aggregationType timeBucket]
 */
module.exports = QuerySchema
  .create(TS_RANGE)
  .data({ executable: true })
  .methodName('range')
  .param(
    'key',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  )
  .param(
    'fromTimestamp',
    (value) => !Validator.isUndefined(value) && Validator.isInteger(value) && value >= 0
  )
  .param(
    'toTimestamp',
    (value) => !Validator.isUndefined(value) && Validator.isInteger(value) && value >= 0
  )
  .subquery(count)
  .subquery(aggregation);
