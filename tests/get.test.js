
const RedisMock = require('./__mocks__/redis');

const { commands } = require('../src/constants');
const RedisTimeSeries = require('../src/RedisTimeSeries');

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

    const redisCommandParams = RedisMock.send_command.mock.calls[0];
    expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should throw an error, no arguments', async () => {
    await expect(rts.get()).rejects.toThrow();
  });
});
