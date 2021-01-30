const QuerySchema = require('../QuerySchema');
const { Validator } = require('./utils');

const TS_DELETERULE = 'TS.DELETERULE';

/**
 * TS.DELETERULE sourceKey destKey
 */
module.exports = QuerySchema
  .create(TS_DELETERULE)
  .data({ executable: true })
  .methodName('deleteRule')
  .param(
    'sourceKey',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  )
  .param(
    'destKey',
    (value) => !Validator.isUndefined(value) && Validator.isString(value)
  );
