
const QuerySchema = require('../QuerySchema');
const Validator = require('../Validator');

const { retention, labels } = require('./fragments');
const TS_ALTER = 'TS.ALTER';


/**
 * TS.ALTER key [RETENTION retentionTime] [LABELS field value..]
 */
module.exports = QuerySchema
  .create(TS_ALTER)
  .executable()
  .methodName('alter')
  .param(
    'key',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  )
  .serialize((key) => [TS_ALTER, key])
  .subquery(retention)
  .subquery(labels);
