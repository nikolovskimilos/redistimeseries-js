
const QuerySchema = require('../QuerySchema');
const Validator = require('../Validator');

const { retention, labels, uncompressed } = require('./fragments');
const TS_ADD = 'TS.ADD';


/**
 * TS.ADD key timestamp value [RETENTION retentionTime] [LABELS field value..] [UNCOMPRESSED]
 */
module.exports = QuerySchema
  .create(TS_ADD)
  .executable()
  .methodName('add')
  .param(
    'key',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  )
  .param(
    'timestamp',
    (value) => !Validator.isUndefined(value) && Validator.isInteger(value) && value > 0
  )
  .param(
    'value',
    (value) => !Validator.isUndefined(value) && Validator.isFloat(value) 
  )
  .serialize((key, timestamp, value) => `${TS_ADD} ${key} ${timestamp} ${value}`)
  .subquery(retention)
  .subquery(labels)
  .subquery(uncompressed);
