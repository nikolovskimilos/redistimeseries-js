const QuerySchema = require('../../QuerySchema');
const { Validator, Filter } = require('../utils');

const FILTER = 'FILTER';
const SIGN_SPACE = ' ';

/**
 * FILTER filter...
 */
module.exports = QuerySchema
  .create(FILTER)
  .exports({ Filter })
  .param(
    'filter',
    (value) => !Validator.isUndefined(value) && Array.isArray(value) && value.length > 0
  )
  .serialize((command, filter) => [command, ...filter].join(SIGN_SPACE));
