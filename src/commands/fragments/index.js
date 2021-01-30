
const aggregation = require('./aggregation');
const count = require('./count');
const duplicatePolicy = require('./duplicatePolicy');
const filter = require('./filter');
const labels = require('./labels');
const onDuplicate = require('./onDuplicate')
const retention = require('./retention');
const timestamp = require('./timestamp');
const uncompressed = require('./uncompressed');
const withLabels = require('./withLabels');


module.exports = {
  aggregation,
  count,
  duplicatePolicy,
  filter,
  labels,
  onDuplicate,
  retention,
  timestamp,
  uncompressed,
  withLabels
};
