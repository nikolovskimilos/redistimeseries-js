const QuerySchema = require('../../QuerySchema');


const WITHLABELS = 'WITHLABELS';

/**
 * WITHLABELS
 */
module.exports = QuerySchema
  .create(WITHLABELS)
  .methodName('withLabels')
  .serialize(() => [WITHLABELS]);
