const QuerySchema = require('../../QuerySchema');


const UNCOMPRESSED = 'UNCOMPRESSED';

/**
 * UNCOMPRESSED
 */
module.exports = QuerySchema
  .create(UNCOMPRESSED)
  .serialize(() => [UNCOMPRESSED]);
