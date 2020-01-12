
const QuerySchema = require('../QuerySchema');
const { Validator, Filter } = require('./utils');

const TS_MGET = 'TS.MGET';

/**
 * TS.GET key
 */
module.exports = QuerySchema
  .create(TS_MGET)
  .exports({ Filter })
  .data({ executable: true })
  .methodName('mget')
  .param()
  .serialize((key) => [TS_MGET, key]);
