const QuerySchema = require('../QuerySchema');
const { Validator } = require('./utils');

const TS_MADD = 'TS.MADD';
const SIGN_SPACE = ' ';

/**
 * TS.MADD key timestamp value [key timestamp value ...]
 */
module.exports = QuerySchema
  .create(TS_MADD)
  .methodName('madd')
  .param(
    'values',
    (values) => !Validator.isUndefined(values) && Array.isArray(values) && values.length > 0
  )
  .serialize((command, values) => values
    .reduce(
      (acc, { key, timestamp, value }) => acc.concat([key, timestamp, value]),
      [command]
    )
    .join(SIGN_SPACE));
