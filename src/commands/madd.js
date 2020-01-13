const QuerySchema = require('../QuerySchema');
const { Validator } = require('./utils');

const TS_MADD = 'TS.MADD';

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
  .serialize((values) => values.reduce(
  	(acc, { key, timestamp, value }) => acc.concat([key, timestamp, value]), 
  	[TS_MADD]
  ));
