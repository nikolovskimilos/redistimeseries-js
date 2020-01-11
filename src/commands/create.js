
const QuerySchema = require('../QuerySchema');
const Validator = require('../Validator');

const { retention, labels, uncompressed } = require('./fragments');
const TS_CREATE = 'TS.CREATE';


/**
 * TS.CREATE key [RETENTION retentionTime] [LABELS field value..] [UNCOMPRESSED]
 */
module.exports = QuerySchema
  .create(TS_CREATE)
  .executable()
  .methodName('create')
  .param(
    'key',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  )
  .serialize((key) => [TS_CREATE, key])
  .subquery(retention)
  .subquery(labels)
  .subquery(uncompressed);
