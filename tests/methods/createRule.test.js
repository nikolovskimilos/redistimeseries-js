const { commands, keywords } = require('../constants');
const RedisTimeSeries = require('../../index');

const { Aggregation } = RedisTimeSeries;

const { AGGREGATION } = keywords;
const { TS_CREATERULE } = commands;

const SIGN_SPACE = ' ';
const TEST_OPTIONS = {
  host: 'localhost',
  port: 6379
};
const TEST_PARAMS = {
  srcKey: 'sourceKey',
  dstKey: 'destinationKey',
  aggregation: {
    type: Aggregation.AVG,
    timeBucket: 60000
  }
};

let rts = null;
let aggregationQuery = null;

const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query.join(SIGN_SPACE));
};

describe('createRule method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);

    const { aggregation } = TEST_PARAMS;
    aggregationQuery = [AGGREGATION, aggregation.type, aggregation.timeBucket];
  });

  it('should create aggregation rule', async () => {
    const { srcKey, dstKey, aggregation } = TEST_PARAMS;
    const query = [TS_CREATERULE, srcKey, dstKey, ...aggregationQuery];

    await rts
      .createRule(srcKey, dstKey)
      .aggregation(aggregation.type, aggregation.timeBucket)
      .send();

    validateQuery(query);
  });

  it('should throw an error, no arguments', async () => {
    await expect(rts.createRule().send()).rejects.toThrow();
  });

  it('should throw an error, source key is invalid', async () => {
    await expect(rts.createRule({}).send()).rejects.toThrow();
  });

  it('should throw an error, destination key is invalid', async () => {
    await expect(rts.createRule(TEST_PARAMS.srcKey, {}).send()).rejects.toThrow();
  });

  it('should throw an error, aggregation is missing', async () => {
    const { srcKey, dstKey } = TEST_PARAMS;
    await expect(rts.createRule(srcKey, dstKey).send()).rejects.toThrow();
  });

  it('should throw an error, timeBucket is invalid', async () => {
    const { srcKey, dstKey, aggregation } = TEST_PARAMS;
    const { type } = aggregation;
    await expect(rts.createRule(srcKey, dstKey).aggregation(type, true).send()).rejects.toThrow();
  });
});
