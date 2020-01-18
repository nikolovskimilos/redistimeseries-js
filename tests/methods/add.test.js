
const { commands, keywords } = require('../constants');
const RedisTimeSeries = require('../../index');

const { RETENTION, LABELS, UNCOMPRESSED } = keywords;
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
  timestamp: Date.now()
};

let rts = null;
let labelsQuery = null;


const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query.join(SIGN_SPACE));
};

describe('add method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);

    const { labels } = TEST_PARAMS;

    labelsQuery = [LABELS, 'room', labels.room, 'section', labels.section];
  });

  it('should add a value to time series', async () => {
    const { key, timestamp, value } = TEST_PARAMS;
    const query = [TS_ADD, key, timestamp, value];

    await rts.add(key, timestamp, value).send();
    validateQuery(query);
  });

  it('should add a value time series with retention', async () => {
    const { key, timestamp, value, retention } = TEST_PARAMS;
    const query = [TS_ADD, key, timestamp, value, RETENTION, retention];

    await rts.add(key, timestamp, value).retention(retention).send();
    validateQuery(query);
  });

  it('should add a value time series with labels', async () => {
    const { key, timestamp, value, labels } = TEST_PARAMS;
    const query = [TS_ADD, key, timestamp, value, ...labelsQuery];

    await rts.add(key, timestamp, value).labels(labels).send();
    validateQuery(query);
  });

  it('should add a value time series with retention, uncompressed flag and labels', async () => {
    const { key, timestamp, value, retention, labels } = TEST_PARAMS;
    const query = [TS_ADD, key, timestamp, value, RETENTION, retention, UNCOMPRESSED, ...labelsQuery];

    await rts
      .add(key, timestamp, value)
      .retention(retention)
      .labels(labels)
      .uncompressed()
      .send();

    validateQuery(query);
  });

  it('should throw an error, no arguments', async () => {
    await expect(rts.add().send()).rejects.toThrow();
  });

  it('should throw an error, timestamp and value are missing', async () => {
    await expect(rts.add(TEST_PARAMS.key).send()).rejects.toThrow();
  });

  it('should throw an error, value is missing', async () => {
    await expect(rts.add(TEST_PARAMS.key, TEST_PARAMS.timestamp).send()).rejects.toThrow();
  });

  it('should throw an error, value is not valid', async () => {
    const { key, timestamp } = TEST_PARAMS;
    await expect(rts.add(key, timestamp, true).send()).rejects.toThrow();
  });
});
