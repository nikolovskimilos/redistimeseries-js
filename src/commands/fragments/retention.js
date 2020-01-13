const QuerySchema = require('../../QuerySchema');
const { Validator } = require('../utils');

const RETENTION = 'RETENTION';

/**
 * RETENTION retentionTime
 */
module.exports = QuerySchema
  .create(RETENTION)
  .param(
    'retention',
    (value) => !Validator.isUndefined(value) && Validator.isInteger(value) && value >= 0
  )
  .serialize((retention) => [RETENTION, retention]);
