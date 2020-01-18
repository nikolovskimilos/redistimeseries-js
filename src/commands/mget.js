
const QuerySchema = require('../QuerySchema');
const { filter } = require('./fragments');

const TS_MGET = 'TS.MGET';

/**
 * TS.MGET FILTER filter...
 */
module.exports = QuerySchema
  .create(TS_MGET)
  .data({ executable: true })
  .methodName('mget')
  .subquery(filter, true);
