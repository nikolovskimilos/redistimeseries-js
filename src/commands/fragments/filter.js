const QuerySchema = require('../../QuerySchema');
const { Validator, Filter } = require('../utils');

const FILTER = 'FILTER';

/**
 * FILTER filter...
 */
module.exports = QuerySchema
  .create(FILTER)
  .exports({ Filter })
  .param(
    'filter',
    (value) => !Validator.isUndefined(value) && Validator.isArray(value) && value.length > 0
  )
  .serialize((filter) => [FILTER]);
