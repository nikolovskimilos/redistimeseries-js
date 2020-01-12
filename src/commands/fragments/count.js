const QuerySchema = require('../../QuerySchema');
const { Validator } = require('../utils');

const COUNT = 'COUNT';

/**
 *COUNT count
 */
module.exports = QuerySchema
  .create(COUNT)
  .param(
    'count',
    (value) => !Validator.isUndefined(value) && Validator.isInteger(value) && value >= 0
  )
  .serialize((count) => [COUNT, count]);
