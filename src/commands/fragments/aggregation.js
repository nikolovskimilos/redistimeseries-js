const QuerySchema = require('../../QuerySchema');
const { Validator } = require('../utils');

const Aggregation = {
  AVG: 'avg',
  SUM: 'sum',
  MIN: 'min',
  MAX: 'max',
  RANGE: 'range',
  COUNT: 'count',
  FIRST: 'first',
  LAST: 'last',
  STDP: 'std.p',
  STDS: 'std.s',
  VARP: 'var.p',
  VARS: 'var.s'
};

const AggregationTypes = Object.values(Aggregation);

const AGGREGATION = 'AGGREGATION';

/**
 * AGGREGATION aggregationType timeBucket
 */
module.exports = QuerySchema
  .create(AGGREGATION)
  .exports({ Aggregation })
  .param(
    'aggregationType',
    (value) => AggregationTypes.includes(value)
  )
  .param(
    'timeBucket',
    (value) => (
      !Validator.isUndefined(value)
      && Validator.isInteger(value)
    )
  );
