const { commands, keywords } = require('../constants');
const RedisTimeSeries = require('../../index');

const { Aggregation } = RedisTimeSeries;

const { AGGREGATION, COUNT } = keywords;
const { TS_REVRANGE } = commands;
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
  count: 20
};

let rts = null;

const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query.join(SIGN_SPACE));
};

describe('range method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should fetch range of time series for given key', async () => {
    const { key, fromTimestamp, toTimestamp } = TEST_PARAMS;
    const query = [TS_REVRANGE, key, fromTimestamp, toTimestamp];

    await rts.revrange(key, fromTimestamp, toTimestamp).send();
    validateQuery(query);
  });

  it('should fetch N items in range of time series for given key', async () => {
    const { key, fromTimestamp, toTimestamp, count } = TEST_PARAMS;
    const query = [TS_REVRANGE, key, fromTimestamp, toTimestamp, COUNT, count];

    await rts
      .revrange(key, fromTimestamp, toTimestamp)
      .count(count)
      .send();

    validateQuery(query);
  });

  it('should fetch N items in range of time series for given key and aggregation', async () => {
    const { key, fromTimestamp, toTimestamp, count, aggregation } = TEST_PARAMS;
    const { type, timeBucket } = aggregation;
    const aggregationQuery = [AGGREGATION, type, timeBucket];
    const query = [TS_REVRANGE, key, fromTimestamp, toTimestamp, COUNT, count, ...aggregationQuery];

    await rts
      .revrange(key, fromTimestamp, toTimestamp)
      .count(count)
      .aggregation(type, timeBucket)
      .send();

    validateQuery(query);
  });

  it('should fetch range of time series for given key and aggregation', async () => {
    const { key, fromTimestamp, toTimestamp, aggregation } = TEST_PARAMS;
    const { type, timeBucket } = aggregation;
    const aggregationQuery = [AGGREGATION, type, timeBucket];
    const query = [TS_REVRANGE, key, fromTimestamp, toTimestamp, ...aggregationQuery];

    await rts
      .revrange(key, fromTimestamp, toTimestamp)
      .aggregation(type, timeBucket)
      .send();

    validateQuery(query);
  });

  it('should fail, no arguments', async () => {
    await expect(rts.revrange().send()).rejects.toThrow();
  });

  it('should fail, no range timestamps', async () => {
    await expect(rts.revrange(TEST_PARAMS.key).send()).rejects.toThrow();
  });

  it('should fail, no toTimestamp', async () => {
    const { key, fromTimestamp } = TEST_PARAMS;
    await expect(rts.revrange(key, fromTimestamp).send()).rejects.toThrow();
  });

  it('should fail, count not valid', async () => {
    const { key, fromTimestamp, toTimestamp } = TEST_PARAMS;
    await expect(rts.revrange(key, fromTimestamp, toTimestamp).count(true).send()).rejects.toThrow();
  });
});
