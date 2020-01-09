
const { commands } = require('../../src/constants');
const RedisTimeSeries = require('../../index');

const { TS_GET } = commands;
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
  expect([command, ...params].join(SIGN_SPACE)).toBe(query);
};


describe('get method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should fetch time series', async () => {
    const { key } = TEST_PARAMS;
    const query = `${TS_GET} ${key}`;

    await rts.get(key);
    validateQuery(query);
  });

  it('should throw an error, no arguments', async () => {
    await expect(rts.get()).rejects.toThrow();
  });
});
