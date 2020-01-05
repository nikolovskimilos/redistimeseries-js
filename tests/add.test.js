
const RedisMock = require('./__mocks__/redis');

const { commands, keywords } = require('../src/constants');
const RedisTimeSeries = require('../src/RedisTimeSeries');

const { RETENTION, LABELS } = keywords;
const { TS_ADD } = commands;


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
  timestamp: Date.now(),
  uncompressed: true
};

let rts = null;


describe('add method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should add a value to time series', async () => {
    const { key, timestamp, value } = TEST_PARAMS;
    const query = `${TS_ADD} ${key} ${timestamp} ${value}`;

    await rts.add(key, timestamp, value);

    const redisCommandParams = RedisMock.send_command.mock.calls[0];
    expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should add a value time series with retention', async () => {
    const { key, timestamp, value, retention } = TEST_PARAMS;
    const query = `${TS_ADD} ${key} ${timestamp} ${value} ${RETENTION} ${retention}`;

    await rts.add(key, timestamp, value, { retention });

    const redisCommandParams = RedisMock.send_command.mock.calls[0];
    expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should add a value time series with labels', async () => {
    const { key, timestamp, value, labels } = TEST_PARAMS;

    const labelsQuery = `${LABELS} room ${labels.room} section ${labels.section}`;
    const query = `${TS_ADD} ${key} ${timestamp} ${value} ${labelsQuery}`;

    await rts.add(key, timestamp, value, { labels });

    const redisCommandParams = RedisMock.send_command.mock.calls[0];
    expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should add a value time series with retention and labels', async () => {
    const { key, timestamp, value, retention, labels } = TEST_PARAMS;

    const labelsQuery = `${LABELS} room ${labels.room} section ${labels.section}`;
    const query = `${TS_ADD} ${key} ${timestamp} ${value} ${RETENTION} ${retention} ${labelsQuery}`;

    await rts.add(key, timestamp, value, { retention, labels });

    const redisCommandParams = RedisMock.send_command.mock.calls[0];
    expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should throw an error, no arguments', async () => {
    await expect(rts.add()).rejects.toThrow();
  });

  it('should throw an error, timestamp and value are missing', async () => {
    await expect(rts.add(TEST_PARAMS.key)).rejects.toThrow();
  });

  it('should throw an error, value is missing', async () => {
    await expect(rts.add(TEST_PARAMS.key, TEST_PARAMS.timestamp)).rejects.toThrow();
  });

  it('should throw an error, value is not valid', async () => {
    const { key, timestamp, uncompressed } = TEST_PARAMS;
    await expect(rts.add(key, timestamp, uncompressed)).rejects.toThrow();
  });
});
