
const QuerySchema = require('../QuerySchema');
const { Validator } = require('./utils');

const TS_GET = 'TS.GET';


/**
 * TS.GET key
 */
module.exports = QuerySchema
  .create(TS_GET)
  .data({ executable: true })
  .methodName('get')
  .param(
    'key',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  );
