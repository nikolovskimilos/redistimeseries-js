const { commands, keywords } = require('../constants');
const RedisTimeSeries = require('../../index');

const { RETENTION, LABELS } = keywords;
const { TS_ALTER } = commands;

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
  }
};

let rts = null;
let labelsQuery = null;

const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query.join(SIGN_SPACE));
};

describe('alter method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);

    const { labels } = TEST_PARAMS;
    labelsQuery = [LABELS, 'room', labels.room, 'section', labels.section];
  });

  it('should alter time series', async () => {
    const { key } = TEST_PARAMS;
    const query = [TS_ALTER, TEST_PARAMS.key];

    await rts.alter(key).send();
    validateQuery(query);
  });

  it('should alter time series with retention', async () => {
    const { key, retention } = TEST_PARAMS;
    const query = [TS_ALTER, key, RETENTION, retention];

    await rts.alter(key).retention(retention).send();
    validateQuery(query);
  });

  it('should alter time series with labels', async () => {
    const { key, labels } = TEST_PARAMS;
    const query = [TS_ALTER, key, ...labelsQuery];

    await rts.alter(key).labels(labels).send();
    validateQuery(query);
  });

  it('should alter time series with retention and labels', async () => {
    const { key, retention, labels } = TEST_PARAMS;
    const query = [TS_ALTER, key, RETENTION, retention, ...labelsQuery];

    await rts.alter(key).retention(retention).labels(labels).send();
    validateQuery(query);
  });

  it('should throw an error, key is missing', async () => {
    await expect(rts.alter().send()).rejects.toThrow();
  });

  it('should throw an error, key is not valid', async () => {
    await expect(rts.alter(TEST_PARAMS.labels).send()).rejects.toThrow();
  });
});
