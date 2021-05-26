const QuerySchema = require('../QuerySchema');
const { Validator } = require('./utils');
const { count, aggregation, withLabels, filter } = require('./fragments');

const TS_MREVRANGE = 'TS.MREVRANGE';

/**
 * TS.MREVRANGE fromTimestamp toTimestamp [COUNT count] [AGGREGATION aggregationType timeBucket] [WITHLABELS] FILTER filter..
 */
module.exports = QuerySchema
  .create(TS_MREVRANGE)
  .data({ executable: true })
  .methodName('mrevrange')
  .param(
    'fromTimestamp',
    (value) => !Validator.isUndefined(value) && Validator.isInteger(value) && value >= 0
  )
  .param(
    'toTimestamp',
    (value) => !Validator.isUndefined(value) && Validator.isInteger(value) && value >= 0
  )
  .subquery(count)
  .subquery(aggregation)
  .subquery(withLabels)
  .subquery(filter, true);
