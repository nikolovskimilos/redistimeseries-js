
const { commands, keywords } = require('../constants');
const RedisTimeSeries = require('../../index');

const { Aggregation, Filter } = RedisTimeSeries;

const { AGGREGATION, FILTER, WITHLABELS, COUNT } = keywords;
const { TS_MRANGE } = commands;
const SIGN_SPACE = ' ';


const TEST_OPTIONS = {
  host: 'localhost',
  port: 6379
};
const TEST_PARAMS = {
  key: 'sometestkey',
  fromTimestamp: Date.now() - 10000,
  toTimestamp: Date.now(),
  aggregation: {
    type: Aggregation.AVG,
    timeBucket: 60000
  },
  filter: {
    label1: 'somelabel1',
    label2: 'somelabel1',
    value1: 22,
    value2: 23
  },
  count: 20
};

let rts = null;

const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query.join(SIGN_SPACE));
};


describe('mrange method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should fetch range of multiple time series', async () => {
    const { fromTimestamp, toTimestamp, filter } = TEST_PARAMS;
    const { label1, label2 } = filter;
    const query = [TS_MRANGE, fromTimestamp, toTimestamp, FILTER, `${label1}!=`, `${label2}=`];

    await rts
      .mrange(fromTimestamp, toTimestamp)
      .filter([
        Filter.exists(label1),
        Filter.notExists(label2)
      ])
      .send();

    validateQuery(query);
  });

  it('should fetch N items in range of multiple time series', async () => {
    const { fromTimestamp, toTimestamp, count, filter } = TEST_PARAMS;
    const { label1, value1 } = filter;
    const filterQuery = `${FILTER} ${label1}=${value1}`;
    const query = [TS_MRANGE, fromTimestamp, toTimestamp, COUNT, count, filterQuery];

    await rts
      .mrange(fromTimestamp, toTimestamp)
      .count(count)
      .filter([Filter.equal(label1, value1)])
      .send();

    validateQuery(query);
  });

  it('should fetch N items in range of time series for given key and aggregation', async () => {
    const { fromTimestamp, toTimestamp, count, aggregation, filter } = TEST_PARAMS;
    const { type, timeBucket } = aggregation;
    const { label1, value1 } = filter;

    const filterQuery = `${FILTER} ${label1}!=${value1}`;
    const aggregationQuery = [AGGREGATION, type, timeBucket];
    const query = [TS_MRANGE, fromTimestamp, toTimestamp, COUNT, count, ...aggregationQuery, filterQuery];

    await rts
      .mrange(fromTimestamp, toTimestamp)
      .filter([Filter.notEqual(label1, value1)])
      .count(count)
      .aggregation(type, timeBucket)
      .send();

    validateQuery(query);
  });

  it('should fetch range of time series with labels for given key and aggregation', async () => {
    const { fromTimestamp, toTimestamp, aggregation, filter } = TEST_PARAMS;
    const { type, timeBucket } = aggregation;
    const { label1, value1 } = filter;

    const filterQuery = `${FILTER} ${label1}!=${value1}`;
    const aggregationQuery = [AGGREGATION, type, timeBucket];
    const query = [TS_MRANGE, fromTimestamp, toTimestamp, ...aggregationQuery, WITHLABELS, filterQuery];

    await rts
      .mrange(fromTimestamp, toTimestamp)
      .filter([Filter.notEqual(label1, value1)])
      .withLabels()
      .aggregation(type, timeBucket)
      .send();

    validateQuery(query);
  });

  it('should fail, no arguments', async () => {
    await expect(rts.mrange().send()).rejects.toThrow();
  });

  it('should fail, no toTimestamp', async () => {
    const { fromTimestamp } = TEST_PARAMS;
    await expect(rts.mrange(fromTimestamp).send()).rejects.toThrow();
  });

  it('should fail, no filter', async () => {
    const { fromTimestamp, toTimestamp } = TEST_PARAMS;
    await expect(rts.mrange(fromTimestamp, toTimestamp).send()).rejects.toThrow();
  });

  it('should fail, filter is empty', async () => {
    const { fromTimestamp, toTimestamp } = TEST_PARAMS;
    await expect(rts.mrange(fromTimestamp, toTimestamp).filter().send()).rejects.toThrow();
  });

  it('should fail, invalid filter ', async () => {
    const { fromTimestamp, toTimestamp } = TEST_PARAMS;
    await expect(rts.mrange(fromTimestamp, toTimestamp).filter().send()).rejects.toThrow();
  });
});
