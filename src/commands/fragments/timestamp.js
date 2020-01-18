const QuerySchema = require('../../QuerySchema');
const { Validator } = require('../utils');

const TIMESTAMP = 'TIMESTAMP';

/**
 * TIMESTAMP timestamp
 */
module.exports = QuerySchema
  .create(TIMESTAMP)
  .param(
    'timestamp',
    (value) => !Validator.isUndefined(value) && Validator.isInteger(value) && value >= 0
  );
