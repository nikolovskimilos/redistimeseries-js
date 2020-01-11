const QuerySchema = require('../../QuerySchema');
const Validator = require('../../Validator');

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

/**
 * AGGREGATION aggregationType timeBucket
 */
module.exports = QuerySchema
  .create('AGGREGATION')
  .exports({ Aggregation })
  .data({
    Aggregation,
    AggregationTypes: Object.entries(Aggregation)
  })
  .param(
    'aggregationType',
    (value) => {
      const { AggregationTypes } = this.data;
      return AggregationTypes.includes(value);
    }
  )
  .param(
    'timeBucket',
    (value) => (
      !Validator.isUndefined(value)
      && Validator.isInteger(value)
    )
  )
  .serialize((aggregationType, timeBucket) =>
    `${AGGREGATION} ${aggregationType} ${timeBucket}`
  );
