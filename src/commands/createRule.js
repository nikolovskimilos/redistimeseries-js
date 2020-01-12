
const QuerySchema = require('../QuerySchema');
const { Validator } = require('./utils');

const { aggregation } = require('./fragments');

const TS_CREATERULE = 'TS.CREATERULE';


/**
 * TS.CREATERULE sourceKey destKey AGGREGATION aggregationType timeBucket
 */
module.exports = QuerySchema
  .create(TS_CREATERULE)
  .data({ executable: true })
  .methodName('createRule')
  .param(
    'sourceKey',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  )
  .param(
    'destKey',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  )
  .serialize((sourceKey, destKey) => [TS_CREATERULE, sourceKey, destKey])
  .subquery(aggregation, true);
