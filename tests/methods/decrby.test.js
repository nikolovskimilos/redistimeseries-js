
const { commands, keywords } = require('../../src/constants');
const RedisTimeSeries = require('../../index');

const { TIMESTAMP, RETENTION, LABELS } = keywords;
const { TS_DECRBY } = commands;

const SIGN_SPACE = ' ';
const TEST_OPTIONS = {
  host: 'localhost',
  port: 6379
};
const TEST_PARAMS = {
  key: 'sometestkey',
  retention: 60,
  labels: {
    room: 'livingroom',
    section: 2
  },
  value: 17.4,
  timestamp: Date.now()
};

let rts = null;

const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query);
};


describe('decrBy method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should decrement the latest value of time series', async () => {
    const { key, value } = TEST_PARAMS;
    const query = `${TS_DECRBY} ${key} ${value}`;

    await rts.decrBy(key, value);
    validateQuery(query);
  });

  it('should decrement the latest value of time series with timestamp', async () => {
    const { key, value, timestamp } = TEST_PARAMS;
    const query = `${TS_DECRBY} ${key} ${value} ${TIMESTAMP} ${timestamp}`;

    await rts.decrBy(key, value, { timestamp });
    validateQuery(query);
  });

  it('should decrement the latest value of time series with retention', async () => {
    const { key, value, retention } = TEST_PARAMS;
    const query = `${TS_DECRBY} ${key} ${value} ${RETENTION} ${retention}`;

    await rts.decrBy(key, value, { retention });
    validateQuery(query);
  });

  it('should decrement the latest value of time series with labels', async () => {
    const { key, value, labels } = TEST_PARAMS;
    const query = `${TS_DECRBY} ${key} ${value} ${LABELS} room ${labels.room} section ${labels.section}`;

    await rts.decrBy(key, value, { labels });
    validateQuery(query);
  });

  it('should throw an error, no arguments', async () => {
    await expect(rts.decrBy()).rejects.toThrow();
  });

  it('should throw an error, value is missing', async () => {
    await expect(rts.decrBy(TEST_PARAMS.key)).rejects.toThrow();
  });

  it('should throw an error, value is not valid', async () => {
    await expect(rts.decrBy(TEST_PARAMS.key, TEST_PARAMS.key)).rejects.toThrow();
  });
});
