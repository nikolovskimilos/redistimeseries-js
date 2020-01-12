
const QuerySchema = require('../QuerySchema');
const { Validator } = require('./utils');

const { retention, labels, timestamp, uncompressed } = require('./fragments');

const TS_DECRBY = 'TS.DECRBY';


/**
 * TS.DECRBY key value [TIMESTAMP timestamp] [RETENTION retentionTime] [UNCOMPRESSED] [LABELS field value..]
 */
module.exports = QuerySchema
  .create(TS_DECRBY)
  .data({ executable: true })
  .methodName('decrBy')
  .param(
    'key',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  )
  .param(
    'value',
    (value) => !Validator.isUndefined(value) && Validator.isFloat(value)
  )
  .serialize((key, value) => [TS_DECRBY, key, value])
  .subquery(retention)
  .subquery(timestamp)
  .subquery(uncompressed)
  .subquery(labels);
  