const { commands } = require('../constants');
const RedisTimeSeries = require('../../index');

const { TS_INFO } = commands;
const SIGN_SPACE = ' ';

const TEST_OPTIONS = {
  host: 'localhost',
  port: 6379
};
const TEST_PARAMS = {
  key: 'sometestkey'
};

let rts = null;

const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query.join(SIGN_SPACE));
};

describe('info method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should fetch time series info and statistics', async () => {
    const { key } = TEST_PARAMS;
    const query = [TS_INFO, key];

    await rts.info(key).send();
    validateQuery(query);
  });

  it('should throw an error, no arguments', async () => {
    await expect(rts.info().send()).rejects.toThrow();
  });
});
