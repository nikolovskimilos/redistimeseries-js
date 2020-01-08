
const RedisTimeSeries = require('./src/RedisTimeSeries');
const Filter = require('./src/Filter');
const { aggregationTypes: Aggregation } = require('./src/constants');


module.exports = RedisTimeSeries;
module.exports.Filter = Filter;
module.exports.Aggregation = Aggregation;