
const QuerySchema = require('../QuerySchema');
const { Validator } = require('./utils');

const { retention, labels, uncompressed } = require('./fragments');

const TS_ADD = 'TS.ADD';


/**
 * TS.ADD key timestamp value [RETENTION retentionTime] [LABELS field value..] [UNCOMPRESSED]
 */
module.exports = QuerySchema
  .create(TS_ADD)
  .data({ executable: true })
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
  .subquery(retention)
  .subquery(uncompressed)
  .subquery(labels);
