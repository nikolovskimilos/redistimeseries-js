
const { commands } = require('../../src/constants');
const RedisTimeSeries = require('../../index');

const { TS_MADD } = commands;


const SIGN_SPACE = ' ';
const TEST_OPTIONS = {
  host: 'localhost',
  port: 6379
};
const TEST_PARAMS = {
  single: { key: 'sometestkey', value: 17.4, timestamp: Date.now() },
  multi: [
    { key: 'sometestkey1', value: 15.4, timestamp: Date.now() },
    { key: 'sometestkey2', value: 16.4, timestamp: Date.now() },
    { key: 'sometestkey3', value: 17.4, timestamp: Date.now() }
  ]
};

let rts = null;

const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query);
};

describe('madd method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should add single value to time series', async () => {
    const { single } = TEST_PARAMS;
    const query = `${TS_MADD} ${single.key} ${single.timestamp} ${single.value}`;

    await rts.madd(single);
    validateQuery(query);
  });

  it('should add multiple values to different time series', async () => {
    const { multi } = TEST_PARAMS;

    const multiToArray = multi.reduce((acc, { key, timestamp, value }) => {
      acc.push(`${key} ${timestamp} ${value}`);
      return acc;
    }, []);
    const query = `${TS_MADD} ${multiToArray.join(SIGN_SPACE)}`;

    await rts.madd(...multi);
    validateQuery(query);
  });

  it('should fail, no arguments', async () => {
    await expect(rts.madd()).rejects.toThrow();
  });

  it('should fail, key is missing', async () => {
    const { single } = TEST_PARAMS;
    const { timestamp, value } = single;

    await expect(rts.madd({ timestamp, value })).rejects.toThrow();
  });

  it('should fail, timestamp is missing', async () => {
    const { single } = TEST_PARAMS;
    const { key, value } = single;

    await expect(rts.madd({ key, value })).rejects.toThrow();
  });

  it('should fail, value is missing', async () => {
    const { single } = TEST_PARAMS;
    const { key, timestamp } = single;

    await expect(rts.madd({ key, timestamp })).rejects.toThrow();
  });
});
