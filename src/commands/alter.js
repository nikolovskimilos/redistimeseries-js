const QuerySchema = require('../QuerySchema');
const { Validator } = require('./utils');

const { retention, labels } = require('./fragments');

const TS_ALTER = 'TS.ALTER';

/**
 * TS.ALTER key [RETENTION retentionTime] [LABELS field value..]
 */
module.exports = QuerySchema
  .create(TS_ALTER)
  .data({ executable: true })
  .methodName('alter')
  .param(
    'key',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  )
  .subquery(retention)
  .subquery(labels);
