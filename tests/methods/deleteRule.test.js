const { commands } = require('../constants');
const RedisTimeSeries = require('../../index');

const { TS_DELETERULE } = commands;

const SIGN_SPACE = ' ';
const TEST_OPTIONS = {
  host: 'localhost',
  port: 6379
};
const TEST_PARAMS = {
  srcKey: 'sourceKey',
  dstKey: 'destinationKey'
};

let rts = null;

const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query.join(SIGN_SPACE));
};

describe('deleteRule method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should delete aggregation rule', async () => {
    const { srcKey, dstKey } = TEST_PARAMS;
    const query = [TS_DELETERULE, srcKey, dstKey];

    await rts.deleteRule(srcKey, dstKey).send();
    validateQuery(query);
  });

  it('should throw an error, no arguments', async () => {
    await expect(rts.deleteRule().send()).rejects.toThrow();
  });

  it('should throw an error, source key is invalid', async () => {
    await expect(rts.deleteRule({}).send()).rejects.toThrow();
  });

  it('should throw an error, destination key is invalid', async () => {
    await expect(rts.deleteRule(TEST_PARAMS.srcKey, {}).send()).rejects.toThrow();
  });
});
