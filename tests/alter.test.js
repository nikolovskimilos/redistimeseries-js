
const RedisMock = require('./__mocks__/redis');

const { commands, keywords } = require('../src/constants');
const RedisTimeSeries = require('../src/RedisTimeSeries');

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

const validateQuery = (query) => {
  const [commands, params] = RedisMock.send_command.mock.calls[0];
  expect([commands, ...params].join(SIGN_SPACE)).toBe(query);
}


describe('alter method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should alter time series', async () => {
    const { key } = TEST_PARAMS;
    const query = `${TS_ALTER} ${TEST_PARAMS.key}`;

    await rts.alter(key);
    validateQuery(query);
  });

  it('should alter time series with retention', async () => {
    const { key, retention } = TEST_PARAMS;
    const query = `${TS_ALTER} ${key} ${RETENTION} ${retention}`;

    await rts.alter(key, { retention });
    validateQuery(query);
  });

  it('should alter time series with labels', async () => {
    const { key, labels } = TEST_PARAMS;
    const query = `${TS_ALTER} ${key} ${keywords.LABELS} room ${labels.room} section ${labels.section}`;

    await rts.alter(key, { labels });
    validateQuery(query);
  });

  it('should alter time series with retention and labels', async () => {
    const { key, retention, labels } = TEST_PARAMS;

    const labelsQuery = `${LABELS} room ${labels.room} section ${labels.section}`;
    const query = `${TS_ALTER} ${key} ${RETENTION} ${retention} ${labelsQuery}`;

    await rts.alter(key, { retention, labels });
    validateQuery(query);
  });

  it('should throw an error, key is missing', async () => {
    await expect(rts.alter()).rejects.toThrow();
  });

  it('should throw an error, key is not valid', async () => {
    await expect(rts.alter(TEST_PARAMS.labels)).rejects.toThrow();
  });
});
