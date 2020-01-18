
const QuerySchema = require('../QuerySchema');
const { Validator } = require('./utils');

const TS_INFO = 'TS.INFO';


/**
 * TS.INFO key
 */
module.exports = QuerySchema
  .create(TS_INFO)
  .data({ executable: true })
  .methodName('info')
  .param(
    'key',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  );
